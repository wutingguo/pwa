import musicArray from './musicArray';
import selectedMusics from './selectedMusics';
import music from './music';
import tags from './tags';

export default {
	...musicArray,
	...selectedMusics,
	...music,
	...tags
};