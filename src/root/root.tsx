import { observer } from 'mobx-react'
import * as React from 'react'

import styles from './root.module.scss'

import { Form } from '../screens/edit/form'
import { List } from '../screens/list/list'
import { data } from '../stores'

interface IRootProps {}

export const Root = observer((_props: IRootProps) => {
    return <div className={styles.root}>{typeof data.editId === 'string' ? <Form /> : <List />}</div>
})
