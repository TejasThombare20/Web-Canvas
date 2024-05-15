import React from "react";

import TextComponent from "./Text";
import { EditorElement } from "@/provider/editor/editor-provider";
import Container from "./Container";
import VideoComponent from "./Video";
import LinkComponent from "./Link-component";
import ContactFormComponent from "./Contact-form-component";
import Checkout from "./Checkout";

type Props = {
  element: EditorElement;
};

const Recursive = ({ element }: Props) => {
  switch (element.type) {
    case "text":
      return <TextComponent element={element} />;

    case "container":
      return <Container element={element} />;

    case "video":
      return <VideoComponent element={element} />;

    case "contactForm":
      return <ContactFormComponent element={element} />;

    case "paymentForm":
      return <Checkout element={element} />;

    case "2Col":
      return <Container element={element} />;

    case "__body":
      return <Container element={element} />;

    case "link":
      return <LinkComponent element={element} />;

    default:
      return null;
  }
};

export default Recursive;
