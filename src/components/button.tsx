import { clsx } from 'clsx'
import { observer } from 'mobx-react'
import * as React from 'react'

import styles from './button.module.scss'

interface IButtonProps {
    bad?: boolean
    children: React.ReactNode
    className?: string
    disabled?: boolean
    onClick(): void
}

export const Button: React.FC<IButtonProps> = observer((props) => {
    const { onClick } = props

    const self = React.useRef<HTMLDivElement>(null)

    React.useEffect(() => {
        if (!self.current) {
            return
        }

        const touch = new Hammer(self.current)

        touch.on('tap', onClick)

        return () => touch.destroy()
    }, [self, onClick])

    return (
        <div
            ref={self}
            className={clsx(styles.button, props.className, props.disabled && styles.disabled, props.bad && styles.bad)}
        >
            {props.children}
        </div>
    )
})
