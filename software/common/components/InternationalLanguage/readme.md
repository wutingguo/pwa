- Dome
```
    import { InternationalProvide, useLanguage, combinLanguage } from '@common/components/InternationalLanguage';
    import Item from './Item';
    import Item2 from './Item2';


    function App(props) {
        const {children} = props;
        const language = {
            cn: {
                OK: '好的',
                CANCEL: '取消',
            },
            en: {
                OK: 'ok',
                CANCEL: 'cancel',
            },
        }
        return <InternationalProvide lang='cn' initLang={language}>
            <Item />
        </InternationalProvide>
    }




    export function Item() {
        const {intl, lang} = useLanguage();
        console.log(lang); // cn

        return <div>{intl.tf('OK')}</div> // 好的
    }


    class Item2 extends React.Component {
         constructor(props) {
            super(props);
         }

         render() {
            const {lang, intl} = this.props;
            console.log(lang); // cn
            return <div>{intl.tf('OK')}</div> // 好的
         }
    }

    export combinLanguage(Item2);
```


- Dome2
```
    import { InternationalProvide, useLanguage, combinLanguage } from '@common/components/InternationalLanguage';
    import Item from './Item';
    import Item2 from './Item2';


    function App(props) {
        const {children} = props;
        const language = {
            cn: {
                OK: '好的',
                CANCEL: '取消',
            },
            en: {
                OK: 'ok',
                CANCEL: 'cancel',
            },
        }
        return <InternationalProvide lang='en' initLang={language}>
            <Item />
        </InternationalProvide>
    }




    export function Item() {
        const {intl, lang} = useLanguage();
        console.log(lang); // en

        return <div>{intl.tf('OK')}</div> // ok
    }


    class Item2 extends React.Component {
         constructor(props) {
            super(props);
         }

         render() {
            const {lang, intl} = this.props;
            console.log(lang); // en
            return <div>{intl.tf('OK')}</div> // ok
         }
    }

    export combinLanguage(Item2);
```