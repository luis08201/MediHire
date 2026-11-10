import { exportCollections } from "../src/lib/cms/export-content";

const target = exportCollections();
console.log(`Exported collections to ${target}`);
