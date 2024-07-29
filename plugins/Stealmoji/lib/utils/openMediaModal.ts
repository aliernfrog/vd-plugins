import { ReactNative } from "@vendetta/metro/common";
import { LazyActionSheet, MediaModalUtils } from "../../modules";

function getSizeAsync(src: string): Promise<[width: number, height: number]> {
    return new Promise((resolve, reject) => {
        ReactNative.Image.getSize(src, (width, height) => {
            resolve([width, height]);
        }, reject);
    });
}

export default async function openMediaModal(src: string) {
    const [width, height] = await getSizeAsync(src);
    const { width: screenWidth, height: screenHeight } = ReactNative.Dimensions.get("window");

    LazyActionSheet.hideActionSheet();
    MediaModalUtils.openMediaModal({
        initialSources: [{
            uri: src,
            sourceURI: src,
            width,
            height,
        }],
        initialIndex: 0,
        originLayout: {
            width: 128,
            height: 128,
            x: (screenWidth / 2) - 64,
            y: (screenHeight) - 64,
            resizeMode: "fill",
        }
    });
}