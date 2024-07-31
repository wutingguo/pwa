import Page from './entries/page'
import { guid } from '@resource/lib/utils/math';
import { PhotoElement } from './entries/element'

export function generatePage({
    width,
    height,
    elementParams = {}
}) {
    const {
        encImgId,
        elementId,
        exifOrientation,
        imageMatting,
        imgRot
    } = elementParams;
    const photoElement = new PhotoElement(
        {
            id: elementId,
            width,
            height,
            pw: 1,
            ph: 1
        },
        {
            imageMatting,
            encImgId,
            exifOrientation,
            imgRot
        })
    const pageConfig = {
        id: guid(),
        width,
        height,
        elements: [photoElement]
    }
    const page = new Page({
        page: pageConfig
    })
    return JSON.parse(JSON.stringify(page));
}