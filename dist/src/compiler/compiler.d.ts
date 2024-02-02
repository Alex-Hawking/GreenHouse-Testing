import { Path } from '../types';
declare function compile(featuresDir: string, registry: Map<RegExp[], string>, bdd: Path): Promise<void>;
export default compile;
