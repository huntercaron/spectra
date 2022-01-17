import Head from "next/head";
import Link from "next/link";
import { getSketchPages } from "../lib/utils/getSketchePages";

export default function Index(props) {
  const { sketches } = props;

  return (
    <>
      <Head>
        <title>ThreeDee Explorations</title>
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <div className="container">
        <h1>Sketches</h1>
        <ul>
          {sketches.map(({ id, slug }) => (
            <Link href={slug} as={slug} key={id}>
              <a>
                <li>
                  <h4>{id}</h4>
                </li>
              </a>
            </Link>
          ))}
        </ul>
      </div>
    </>
  );
}

export async function getStaticProps() {
  const sketches = getSketchPages();

  return {
    props: {
      sketches,
    },
  };
}
