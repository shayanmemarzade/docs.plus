import Head from 'next/head'
import { AppProps } from 'next/app'
import dynamic from 'next/dynamic'
import '../styles/styles.scss'
import '../styles/globals.scss'

import {
  useQuery,
  useMutation,
  useQueryClient,
  QueryClient,
  QueryClientProvider,
} from '@tanstack/react-query'


const RelpadPrompt = dynamic(() => import(`../components/ReloadPrompt`), { ssr: false });


// Create a client
const queryClient = new QueryClient()

export default function MyApp({ Component, pageProps }) {
  return (
    <div id="root">
      <Head>
        <meta charSet="utf-8" />
        <meta httpEquiv="X-UA-Compatible" content="IE=edge" />
        <meta name="robots" content="noindex, nofollow" />
        <meta name="referrer" content="no-referrer" />
        <meta
          name='viewport'
          content='minimum-scale=1, initial-scale=1, width=device-width, shrink-to-fit=no, user-scalable=no, viewport-fit=cover'
        />
         {/* Chrome, Firefox OS and Opera  */}
        <meta name="theme-color" content="#3367D6" />
        <link rel="shortcut icon" href="/icons/favicon.ico" />
        <link rel="icon" type="image/png" href="/icons/maskable_icon_x512.png" />
        <link rel="apple-touch-icon" href="/icons/apple-touch-icon.png" />
        <meta property="og:image" content="/icons/logo.svg" />
        <meta property="og:image:alt" content="docs.plus" />
        <link rel="mask-icon" href="/icons/maskable_icon.png" color="#FFFFFF" />

        {/* Sets whether a web application runs in full-screen mode. See: https://developer.apple.com/library/safari/documentation/AppleApplications/Reference/SafariHTMLRef/Articles/MetaTags.html#//apple_ref/doc/uid/TP40008193-SW3 */}
        <meta name="apple-mobile-web-app-capable" content="yes" />
        {/* Web clip icon for Android homescreen shortcuts. Available since Chrome 31+ for Android.See: https://developers.google.com/chrome/mobile/docs/installtohomescreen */}
        <link rel="shortcut icon" sizes="192x192" href="/icons/android-chrome-192x192.png" />

        <link id="apple-touch-icon" rel="apple-touch-icon" href="/icons/android-chrome-512x512.png" />

        {/* 
          Disables automatic detection of possible phone numbers in a webpage in Safari on iOS.
          See: https://developer.apple.com/library/safari/documentation/AppleApplications/Reference/SafariHTMLRef/Articles/MetaTags.html#//apple_ref/doc/uid/TP40008193-SW5
          See: https://developer.apple.com/library/safari/documentation/AppleApplications/Reference/SafariHTMLRef/Articles/MetaTags.html#//apple_ref/html/const/format-detection
        */}
        <meta name="format-detection" content="telephone=no" /> 
        <meta name="format-detection" content="address=no" />
        <meta content="docs.plus is an open-source, real-time collaborative tool that enables communities to share and organize knowledge in a hierarchical manner. Collaborate on documents and share knowledge in a structured, logical way." name="description" />
        <meta name="keywords" content="docs.plus, real-time, collaborative, open-source, communities, knowledge sharing, Microsoft Word alternative" />
        <link rel="manifest" href="/manifest.json" />
        <title>Docs Plus</title>

        <meta name="application-name" content="Docs Plus" />
        <meta name="apple-mobile-web-app-status-bar-style" content="default" />
        <meta name="apple-mobile-web-app-title" content="Docs Plus" />


        <meta name="twitter:card" content="Docs Plus" />
        <meta name="twitter:url" content="http://docs.plus" />
        <meta name="twitter:title" content="Docs Plus" />
        <meta name="twitter:description" content="docs.plus is an open-source, real-time collaborative tool that enables communities to share and organize knowledge in a hierarchical manner. Collaborate on documents and share knowledge in a structured, logical way." />
        <meta name="twitter:image" content="/icons/maskable_icon_x512.png" />
        <meta property="og:type" content="website" />
        <meta property="og:title" content="Docs Plus" />
        <meta property="og:description" content="docs.plus is an open-source, real-time collaborative tool that enables communities to share and organize knowledge in a hierarchical manner. Collaborate on documents and share knowledge in a structured, logical way." />
        <meta property="og:site_name" content="Docs Plus" />
        <meta property="og:url" content="http://docs.plus" />
        <meta property="og:image" content="/icons/maskable_icon_x512.png" />


      </Head>
      <QueryClientProvider client={queryClient}>
        <Component {...pageProps} />
      </QueryClientProvider>
      <RelpadPrompt />
    </div>
  )
}
