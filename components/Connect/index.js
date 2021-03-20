import dynamic from "next/dynamic";
import { DummyConnect } from "./button";

export default dynamic(() => import("./button"), {
  ssr: false,
  loading: DummyConnect,
});
