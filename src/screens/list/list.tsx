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
    const reload = React.useRef<HTMLSpanElement>(null)

    const { connection } = data

    const onAdd = React.useCallback(() => {
        if (connection === 'connected') {
            data.editId = ''
        }
    }, [connection])

    const onReload = React.useCallback(() => data.reconnect(), [])

    React.useEffect(() => {
        if (!add.current) {
            return
        }

        const touch = new Hammer(add.current)

        touch.on('tap', onAdd)

        return () => touch.destroy()
    }, [add, onAdd])

    React.useEffect(() => {
        if (!reload.current) {
            return
        }

        const touch = new Hammer(reload.current)

        touch.on('tap', onReload)

        return () => touch.destroy()
    }, [reload, onReload])

    return (
        <div className={clsx(styles.list, props.className)}>
            <h1>
                <span>{translations.strings.list}</span>
                <span>&nbsp;</span>
                <span ref={add}>⨁</span>
                <span ref={reload} className={clsx(connection === 'failed' && styles.failed)}>
                    {connection === 'connected' ? '◉' : '◌'}&nbsp;
                </span>
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
