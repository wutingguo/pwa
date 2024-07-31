
export const themeIds = {
  'classic-light': 'classic-light',
  'classic-dark': 'classic-dark',
  'contemporary-light': 'contemporary-light',
  'contemporary-dark': 'contemporary-dark'
};

/**
 * 定义slide show的4中模板主题.
 */
export default [
  {
    id: 'classic-dark',
    name: t('CLASSIC_DARK'),
    backgroundColor: '#000',
    elements: [
      {
        type: 'logo',
        align: 'center',
        logId: 'zno-dark',
        py: 0.197,
        height: 22
      },
      {
        type: 'text',
        text: '',
        align: 'center',
        py: 0.2366,
        color: '#fff',
        fontSize: 20,
        fontWeight: 500
      },
      {
        type: 'video',        
        align: 'center',  
        playBtb: {
          text:'',
          color: '#fff',
          fontSize: 20,
          fontWeight: 500,

          align: 'center',   
          py: 0.4755,
        },
        shareBtn:{
          align: 'left',   
          py: 0.0444,
        },

        py: 0.3044,        
        ph: 0.5
      },
    ]
  },
  {
    id: 'classic-light',
    name: t('CLASSIC_LIGHT'),
    backgroundColor: '#fff',
    elements: [
      {
        type: 'logo',
        align: 'center',
        logId: 'zno-white',
        py: 0.197,
        height: 22
      },
      {
        type: 'text',
        text: '',
        align: 'center',   
        py: 0.2366,
        color: '#3a3a3a',
        fontSize: 20,
        fontWeight: 500
      },
      {
        type: 'video',        
        align: 'center',  
        playBtb: {
          text:'',
          color: '#fff',
          fontSize: 20,
          fontWeight: 500,

          align: 'center',   
          py: 0.4755,
        },
        shareBtn:{
          align: 'left',   
          py: 0.0444,
        },

        py: 0.3044,        
        ph: 0.5
      },
    ]
  },
  {
    id: 'contemporary-dark',
    name: t('CONTEMPORARY_DARK'),
    backgroundColor: '#000',
    elements: [
      {
        type: 'logo',
        align: 'center',
        logId: 'zno-white',
        py: 0.374444,
        height: 22
      },
      {
        type: 'text',
        text: '',
        align: 'center',   
        py: 0.4844444,
        color: '#fff',
        fontSize: 32,
        fontWeight: 500
      },
      {
        type: 'video',        
        align: 'center',  
        playBtb: {
          text:'',
          color: '#fff',
          fontSize: 20,
          fontWeight: 500,

          align: 'center',   
          py: 0.4755,
        },
        shareBtn:{
          align: 'left',   
          py: 0.0444,
        },

        py: 0,        
        ph: 1
      },
    ]
  },
  {
    id: 'contemporary-light',
    name: t('CONTEMPORARY_LIGHT'),
    backgroundColor: '#fff',
    elements: [
      {
        type: 'logo',
        align: 'center',
        logId: 'zno-white',
        py: 0.374444,
        height: 22
      },
      {
        type: 'text',
        text: '',
        align: 'center',   
        py: 0.4844444,
        color: '#fff',
        fontSize: 32,
        fontWeight: 500
      },
      {
        type: 'video',        
        align: 'center',  
        playBtb: {
          text:'',
          color: '#fff',
          fontSize: 20,
          fontWeight: 500,

          align: 'center',   
          py: 0.4755,
        },
        shareBtn:{
          align: 'left',   
          py: 0.0444,
        },

        py: 0,        
        ph: 1
      },
    ]
  }
]