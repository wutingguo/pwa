// 排序
export const SEQUENCE = [
    {
        label: t('PHOTOTAB_ORDER_DATE_TAKEN_O_T_N'),
        value: {
            field: 'shotTime',
            orderBy: 'asc'
        },
        checked: false
    }, {
        label: t('PHOTOTAB_ORDER_DATE_TAKEN_N_T_O'),
        value: {
            field: 'shotTime',
            orderBy: 'desc'
        },
        checked: false
    }, {
        label: t('PHOTOTAB_ORDER_UPLOAD_TIME_O_T_N'),
        value: {
            field: 'uploadTime',
            orderBy: 'asc'
        },
        checked: false
    }, {
        label: t('PHOTOTAB_ORDER_UPLOAD_TIME_N_T_O'),
        value: {
            field: 'uploadTime',
            orderBy: 'desc'
        },
        checked: false
    }, {
        label: t('PHOTOTAB_ORDER_TITLE_A_Z'),
        value: {
            field: 'name',
            orderBy: 'asc'
        },
        checked: false
    }, {
        label: t('PHOTOTAB_ORDER_TITLE_Z_A'),
        value: {
            field: 'name',
            orderBy: 'desc'
        },
        checked: false
    }
];

// Cover Design 
export const COVER_DESIGN = {
    cameo: {
        text: "Add Cameo",
        checked: false,
        value: ""
    },
    spineText: {
        text: "Add Spine Text, Text:",
        checked: false,
        value: "",
        extra: ""
    },
    coverText: {
        text: "Add Cover Text, Text:",
        checked: false,
        value: "",
        extra: ""
    },
    noDesign: {
        text: "No design required",
        checked: false,
        value: ""
    },
    specifyCoverPhoto: {
        text: "Specify the cover photo",
        checked: false,
        value: ""
    }
};
