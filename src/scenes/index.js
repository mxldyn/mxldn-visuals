import * as flyingSphere from './flyingSphere';
import * as flyingBox from './flyingBox';
import * as flyingDiamond from './flyingDiamond';
import * as cubeMadness from './cubeMadness';

export const Build = () => {
    return [
        cubeMadness.Build(),
        flyingBox.Build(),
        flyingDiamond.Build(),
        flyingSphere.Build(),
    ]
}