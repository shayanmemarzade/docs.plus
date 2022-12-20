import { Slice, Fragment, NodeRange, NodeType, Mark, ContentMatch } from "prosemirror-model"

/**
 *
 * @param {Object} tr  transform object
 * @param {Number} start  start pos
 * @param {Number} from  end pos
 * @returns
 */
export const getPrevHeadingList = (tr, start, from) => {
  const titleHMap = []
  if (from < start) throw new Error("[Heading]: position is invalid 'from < start'")
  try {
    tr.doc.nodesBetween(start, from, function (node, pos, parent, index) {
      if (node.type.name === "heading") {
        const headingLevel = node.firstChild?.attrs?.level
        const depth = tr.doc.resolve(pos).depth
        titleHMap.push({
          le: headingLevel,
          node: node.toJSON(),
          depth,
          startBlockPos: pos,
          endBlockPos: pos + node.nodeSize,
        })
      }
    })
  } catch (error) {
    console.error("[Heading]: getPrevHeadingList", error, { tr, start, from })
    // return Slice.empty
  } finally {
    return titleHMap
  }
}
