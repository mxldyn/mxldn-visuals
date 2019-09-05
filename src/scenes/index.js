import * as flyingSphere from './flyingSphere';
import * as flyingBox from './flyingBox';
import * as flyingDiamond from './flyingDiamond';
import {GRID} from './objectGrid';

export const build = () => {
    return [
        GRID.buildWithCubes(),
        GRID.buildWithSpheres(),
        GRID.buildWithDiamonds()
    ]
}