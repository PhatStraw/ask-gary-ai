import 'dotenv/config'
import 'components/styles/globals.css'

export default function App({ Component, pageProps }) {
  return (<div><Component {...pageProps} /></div>)
}
