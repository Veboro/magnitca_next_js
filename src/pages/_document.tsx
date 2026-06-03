import Document, {
  Head,
  Html,
  Main,
  NextScript,
  type DocumentContext,
  type DocumentInitialProps,
} from "next/document";
import { getLocaleFromPathname, type SiteLocale } from "@/lib/locale";

type Props = DocumentInitialProps & {
  locale: SiteLocale;
};

export default class MyDocument extends Document<Props> {
  static async getInitialProps(ctx: DocumentContext): Promise<Props> {
    const initialProps = await Document.getInitialProps(ctx);
    const locale = getLocaleFromPathname(ctx.req?.url);

    return {
      ...initialProps,
      locale,
    };
  }

  render() {
    return (
      <Html lang={this.props.locale} className="official-home-page">
        <Head />
        <body className="official-home official-home-page">
          <Main />
          <NextScript />
        </body>
      </Html>
    );
  }
}
