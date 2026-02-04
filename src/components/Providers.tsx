"use client";

import {ReactNode} from "react";
import {BaseProvider, LightTheme} from "baseui";
import {Provider as StyletronProvider} from "styletron-react";
import {Client, Server} from "styletron-engine-atomic";
import {useServerInsertedHTML} from "next/navigation";
import {useState} from "react";

function createStyletronEngine() {
  if (typeof window === "undefined") {
    return new Server();
  }
  const hydrate = document.getElementsByClassName(
    "_styletron_hydrate_"
  ) as HTMLCollectionOf<HTMLStyleElement>;
  return new Client({hydrate});
}

export default function Providers({children}: {children: ReactNode}) {
  const [styletron] = useState(createStyletronEngine);

  useServerInsertedHTML(() => {
    if (styletron instanceof Server) {
      return <style dangerouslySetInnerHTML={{__html: styletron.getCss()}} />;
    }
    return null;
  });

  return (
    <StyletronProvider value={styletron}>
      <BaseProvider theme={LightTheme}>{children}</BaseProvider>
    </StyletronProvider>
  );
}
