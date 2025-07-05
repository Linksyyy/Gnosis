import path from "node:path";

const meta =  import.meta as any;
export default path.dirname(meta.dir);