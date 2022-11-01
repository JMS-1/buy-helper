import { clsx } from 'clsx'
import { observer } from 'mobx-react'
import * as React from 'react'

import styles from './item.module.scss'

import { data } from '../../stores'
import { IProduct } from '../../stores/data'

interface IItemProps {
    className?: string
    product: IProduct
}

export const Item: React.FC<IItemProps> = observer((props) => {
    const { id, name, variant, unit, unitPrice } = props.product

    const self = React.useRef<HTMLDivElement>(null)

    const { connection } = data

    const onClick = React.useCallback(() => {
        if (connection === 'connected') {
            data.editId = id
        }
    }, [connection, id])

    React.useEffect(() => {
        if (!self.current) {
            return
        }

        const touch = new Hammer(self.current)

        touch.on('tap', onClick)

        return () => touch.destroy()
    }, [self, onClick])

    return (
        <div ref={self} className={clsx(styles.item, props.className)}>
            <div>
                {name}
                {variant && ` (${variant})`}
            </div>
            <div>
                {`${unitPrice}`.replace(/\./g, ',')}/{unit}
            </div>
        </div>
    )
})
