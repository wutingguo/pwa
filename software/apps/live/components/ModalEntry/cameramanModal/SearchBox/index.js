import React, { useState } from 'react';

import { IntlConditionalDisplay } from '@common/components/InternationalLanguage';

import FButton from '@apps/live/components/FButton';
import FInput from '@apps/live/components/FInput';

import { Container, Content, Tip } from './layout';

export default function SearchBox(props) {
  const [value, setValue] = useState(null);
  const { onSearch, intl, lang } = props;

  function _onSearch() {
    onSearch && onSearch(value);
  }
  return (
    <Container>
      <Content>
        <FInput
          value={value}
          onChange={({ target: { value } }) => setValue(value)}
          placeholder={intl.tf('LP_ADD_PHOTOGRAPHER_INPUT_MESSAGE')}
          height={32}
          width={lang === 'cn' ? 220 : 285}
          type="search"
        />
        <FButton style={{ height: 32, width: 100 }} onClick={_onSearch}>
          {intl.tf('LP_SEARCH')}
        </FButton>
      </Content>
      <IntlConditionalDisplay reveals={['en']}>
        <Tip>Enter the email associated with the shooter’s Zno account.</Tip>
      </IntlConditionalDisplay>
    </Container>
  );
}
