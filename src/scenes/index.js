import * as flyingSphere from './flyingSphere';
import * as flyingBox from './flyingBox';
import * as flyingDiamond from './flyingDiamond';
import * as cubeMadness from './cubeMadness';

export const build = () => {
    return [
        cubeMadness.build(),
        flyingBox.build(),
        flyingDiamond.build(),
        flyingSphere.build(),
    ]
}