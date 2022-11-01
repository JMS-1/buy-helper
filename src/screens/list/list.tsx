import { clsx } from 'clsx'
import { observer } from 'mobx-react'
import * as React from 'react'

import { Item } from './item'
import styles from './list.module.scss'

import { data, translations } from '../../stores'

interface IListProps {
    className?: string
}

export const List: React.FC<IListProps> = observer((props) => {
    return (
        <div className={clsx(styles.list, props.className)}>
            <h1>{translations.strings.list}</h1>
            <div>
                {data.ordered.map((p) => (
                    <Item key={p.id} product={p} />
                ))}
            </div>
        </div>
    )
})
