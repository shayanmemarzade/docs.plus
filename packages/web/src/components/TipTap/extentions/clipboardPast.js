import { Slice, Fragment, NodeRange, NodeType, Mark, ContentMatch } from 'prosemirror-model'
import { TextSelection, Selection } from 'prosemirror-state'

import { getRangeBlocks, getHeadingsBlocksMap } from './helper'

const normalizeClipboardContents = (clipboardContents, editor) => {
  const paragraphs = []
  const headings = []
  let heading = null

  for (const node of clipboardContents) {
    if (!heading && node.type !== 'contentHeading') {
      paragraphs.push(editor.schema.nodeFromJSON(node))
    }

    if (node.type === 'contentHeading') {
      // if new heading is found, push the previous heading into the heading list
      // and reset the heading
      if (heading) {
        headings.push(editor.schema.nodeFromJSON(heading))
        heading = null
      }
      heading = {
        type: 'heading',
        attrs: { level: node?.attrs.level },
        content: [
          node,
          {
            type: 'contentWrapper',
            content: []
          }
        ]
      }
    } else {
      heading?.content.at(1).content.push(node)
    }
  }

  if (heading) {
    headings.push(editor.schema.nodeFromJSON(heading))
  }

  return [paragraphs, headings]
}

export default (slice, editor) => {
  const { state, view } = editor
  const { schema, selection, doc, tr } = state
  const { from, to, $anchor } = selection

  let newPosResolver
  let $from = selection.$from
  let start = $from.pos

  // if user cursor is in the heading,
  // move the cursor to the contentWrapper and do the rest
  if ($from.parent.type.name === 'contentHeading') {
    const firstLine = doc.nodeAt(start + 2)

    let resolveNextBlock = tr.doc.resolve(start + 2)

    newPosResolver = resolveNextBlock

    // if the heading block does not contain contentWrapper as a first child
    // then create a contentWrapper block
    if (firstLine.type.name === 'heading') {
      const contentWrapperBlock = {
        type: 'contentWrapper',
        content: [
          {
            type: 'paragraph'
          }
        ]

      }

      const node = state.schema.nodeFromJSON(contentWrapperBlock)

      tr.insert(start, node)
      resolveNextBlock = tr.doc.resolve(start + 2)
    }

    // put the selection to the first line of contentWrapper block
    if (resolveNextBlock.parent.type.name === 'contentWrapper') {
      tr.setSelection(TextSelection.near(resolveNextBlock))
    }
  }

  // If caret selection move to contentWrapper, create a new selection
  if (newPosResolver) {
    $from = (new Selection(
      newPosResolver,
      newPosResolver
    )).$from
  }

  start = $from.pos

  // return Slice.empty

  const titleNode = $from.doc.nodeAt($from.start(1) - 1)
  const titleStartPos = $from.start(1) - 1
  const titleEndPos = titleStartPos + titleNode.content.size
  const contentWrapper = getRangeBlocks(doc, start, titleEndPos)

  let prevHStartPos = 0
  let prevHEndPos = 0

  doc.nodesBetween(titleStartPos, start - 1, function (node, pos, parent, index) {
    if (node.type.name === 'heading') {
      const depth = doc.resolve(pos).depth

      // INFO: this the trick I've looking for
      if (depth === 2) {
        prevHStartPos = pos
        prevHEndPos = pos + node.content.size
      }
    }
  })

  const clipboardContentJson = slice.toJSON().content

  const [paragraphs, headings] = normalizeClipboardContents(clipboardContentJson, state)

  // if there is no heading block, then just return
  if (headings.length <= 0) return slice

  // return Slice.empty
  let shouldNested = false

  tr.delete(to, titleEndPos)

  // first append the paragraphs in the current selection
  tr.replaceWith(tr.mapping.map(from), tr.mapping.map(from), paragraphs)

  const newSelection = new TextSelection(tr.doc.resolve(selection.from))

  tr.setSelection(newSelection)

  let lastBlockPos = tr.mapping.map(start)

  const headingContent = contentWrapper.filter(x => x.type === 'heading')

  if (headingContent.length > 0) {
    headingContent.forEach(heading => headings.push(state.schema.nodeFromJSON(heading)))
  }

  let mapHPost = {}
  // return Slice.empty

  // paste the headings
  for (const heading of headings) {
    const commingLevel = heading.content.firstChild.attrs.level

    const startBlock = tr.mapping.map(start)
    const endBlock = tr.mapping.map(titleEndPos)

    mapHPost = getHeadingsBlocksMap(tr.doc, startBlock, endBlock)

    mapHPost = mapHPost.filter(x =>
      x.startBlockPos >= prevHStartPos
    )

    const prevBlockEqual = mapHPost.findLast(x => x.le === commingLevel)
    const prevBlockGratherFromFirst = mapHPost.find(x => x.le >= commingLevel)
    const prevBlockGratherFromLast = mapHPost.findLast(x => x.le <= commingLevel)

    const lastBlock = mapHPost.at(-1)
    let prevBlock = prevBlockEqual || prevBlockGratherFromLast || prevBlockGratherFromFirst

    if (lastBlock.le <= commingLevel) prevBlock = lastBlock

    shouldNested = prevBlock.le < commingLevel

    // find prevBlock.le in mapHPost
    const robob = mapHPost.filter(x => prevBlock.le === x.le)

    if (robob.length > 1) {
      prevBlock = robob.at(-1)
    }

    lastBlockPos = prevBlock.endBlockPos

    if (prevBlock && prevBlock.depth === 2) {
      prevHStartPos = prevBlock.startBlockPos
    }

    tr.insert(lastBlockPos - (shouldNested ? 2 : 0), heading)
  }
  tr.setMeta('paste', true)
  view.dispatch(tr)

  return Slice.empty
}
