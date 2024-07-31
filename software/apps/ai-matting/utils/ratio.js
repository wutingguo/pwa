import { getSize } from "@resource/lib/utils/helper"

const maxWorkspaceWidthPercent = 0.8;
const maxWorkspaceHeightPercent = 0.8;

function computedWorkSpaceOffset() {
    return {
        top: 82,
        right: 288,
        bottom: 0,
        left: 0
    }
}

function getWorkspaceAvailableSize() {
    const { width: screenWidth, height: screenHeight } = getSize();
    const { top, right, bottom, left } = computedWorkSpaceOffset();
    let availableWidth = (screenWidth - left - right) * maxWorkspaceWidthPercent;
    let availableHeight= (screenHeight - top - bottom) * maxWorkspaceHeightPercent;
    return {
        width: availableWidth,
        height: availableHeight
    }
}

export function updateRatio({
    width, 
    height,
    boundProjectActions
}) {
    const { width: availableWidth, height: availableHeight } = getWorkspaceAvailableSize();
    const imageRatio = width / height;
    const availableWorkspaceRatio = availableWidth / availableHeight;
    let ratio = availableWidth / width;
    if(imageRatio < availableWorkspaceRatio) {
        ratio = availableHeight / height;
    }
    boundProjectActions.updateRatio(ratio);
}