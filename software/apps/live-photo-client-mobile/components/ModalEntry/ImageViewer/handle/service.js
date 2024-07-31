import service from '@apps/workspace/services';
/**
 * 点赞图片
 */
const contentLike = async (that) => {
    const { photoList, initialSlide } = that.state;
    const { qs, urls, userInfo } = that.props;
    const baseUrl = urls.get('saasBaseUrl');
    const enc_broadcast_id = qs.get('enc_broadcast_id');
    const user_unique_id = userInfo.get('user_id');
    const photo = photoList[initialSlide]
    const liked = photo.liked
    const enc_target_id = photo.show_enc_content_id;
    try {
        const data = await service.logTargetOperation({
            baseUrl,
            enc_broadcast_id,
            target_type: '2',
            action_type: liked ? '4' : '2',
            enc_target_id,
            user_unique_id
        });
        if (data && data.ret_code == 200000) {
            photo.liked = !photo.liked
            photo.like_count = photo.like_count + (liked ? -1 : 1)
            that.setState({
                photo: photo
            });
        }
    } catch (e) {
        console.error(e);
    }
}

/**
 * 获取图片点赞
 */
const getContentLike = async (that) => {
    const { photoList, initialSlide } = that.state;
    const { qs, urls, userInfo } = that.props;
    const baseUrl = urls.get('saasBaseUrl');
    const enc_broadcast_id = qs.get('enc_broadcast_id');
    const photo = photoList[initialSlide]
    const enc_target_id = photo.show_enc_content_id;
    const user_unique_id = userInfo.get('user_id');
    try {
        const data = await service.getTargetOperationCount({
            baseUrl,
            enc_broadcast_id,
            target_type: '2',
            action_type: '2',
            enc_target_id,
            user_unique_id
        });
        if (data && data.ret_code == 200000) {
            photo.liked = data.data.liked
            photo.like_count = data.data.count
            that.setState({
                photo: photo
            });
        }
    } catch (e) {
        console.error(e);
    }
}
/**
 * 图片的访问
 */
const contentViewOperation = async (that) => {
    const { photoList, initialSlide } = that.state;
    const { userInfo, qs, urls } = that.props;
    const baseUrl = urls.get('saasBaseUrl');
    const enc_broadcast_id = qs.get('enc_broadcast_id');
    const user_unique_id = userInfo.get('user_id');
    const photo = photoList[initialSlide]
    const enc_target_id = photo.show_enc_content_id;
    try {
        await service.logTargetOperation({
            baseUrl,
            enc_broadcast_id,
            target_type: '2',
            action_type: '1',
            enc_target_id,
            user_unique_id
        });
    } catch (e) {
        console.error(e);
    }
}

export default {
    contentLike,
    getContentLike,
    contentViewOperation
};



