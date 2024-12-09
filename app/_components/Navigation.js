// export default function Navigation() {
//   return (
//     <nav className="z-10 text-xl">
//       <ul className="flex gap-16 items-center">
//         <li>
//           <a href="/cabins" className="hover:text-accent-400 transition-colors">
//             Cabins
//           </a>
//         </li>
//         <li>
//           <a href="/about" className="hover:text-accent-400 transition-colors">
//             About
//           </a>
//         </li>
//         <li>
//           <a
//             href="/account"
//             className="hover:text-accent-400 transition-colors"
//           >
//             Your account
//           </a>
//         </li>
//       </ul>
//     </nav>
//   );
// }

import Link from 'next/link';

export default function Navigation() {
  return (
    <nav className="z-10 text-xl">
      <ul className="flex gap-16 items-center">
        <li>
          <Link
            href="/cabins"
            className="hover:text-accent-400 transition-colors"
          >
            Cabins
          </Link>
        </li>
        <li>
          <Link
            href="/about"
            className="hover:text-accent-400 transition-colors"
          >
            About
          </Link>
        </li>
        <li>
          <Link
            href="/account"
            className="hover:text-accent-400 transition-colors"
          >
            Guest area
          </Link>
        </li>
      </ul>
    </nav>
  );
}
