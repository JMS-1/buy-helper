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
    const add = React.useRef<HTMLSpanElement>(null)

    const onAdd = React.useCallback(() => (data.editId = ''), [])

    React.useEffect(() => {
        if (!add.current) {
            return
        }

        const touch = new Hammer(add.current)

        touch.on('tap', onAdd)

        return () => touch.destroy()
    }, [add, onAdd])

    return (
        <div className={clsx(styles.list, props.className)}>
            <h1>
                <span>{translations.strings.list}</span>
                <span ref={add}>⨁&nbsp;</span>
            </h1>
            <div>
                {data.ordered.map((p) => (
                    <Item key={p.id} product={p} />
                ))}
            </div>
            <span />
        </div>
    )
})
