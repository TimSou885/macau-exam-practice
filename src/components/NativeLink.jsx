import { Link } from '@astryxdesign/core/Link'

function NativeAnchor({ href, children, ...props }) {
  return (
    <a href={href} {...props}>
      {children}
    </a>
  )
}

/** Full page load. Use for /about and other sites so the router does not intercept them. */
export default function NativeLink({ href, children, isExternal = false }) {
  return (
    <Link
      href={href}
      as={NativeAnchor}
      isExternalLink={isExternal}
      newTabLabel="（在新分頁開啟）"
    >
      {children}
    </Link>
  )
}
