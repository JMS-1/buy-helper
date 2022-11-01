import { observer } from 'mobx-react'
import * as React from 'react'

import { translations } from '../stores'

interface IRootProps {}

export const Root = observer((_props: IRootProps) => {
    return <div>{translations.strings.name}</div>
})
