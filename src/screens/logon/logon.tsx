import { clsx } from 'clsx'
import { observer } from 'mobx-react'
import * as React from 'react'

import styles from './logon.module.scss'

import { data, translations } from '../../stores'

interface ILogonProps {
    className?: string
}

export const Logon: React.FC<ILogonProps> = observer((props) => {
    const [userId, setUserId] = React.useState('')

    const self = React.useRef<HTMLDivElement>(null)

    const onChange = (ev: React.ChangeEvent<HTMLInputElement>): void => setUserId(ev.currentTarget.value)

    const onClick = React.useCallback(() => (data.userId = userId), [userId])

    React.useEffect(() => {
        if (!self.current) {
            return
        }

        const touch = new Hammer(self.current)

        touch.on('tap', onClick)

        return () => touch.destroy()
    }, [self, onClick])

    return (
        <div className={clsx(styles.logon, props.className)}>
            <div>
                <div>{translations.strings.logon}</div>
                <input type='text' value={userId} onChange={onChange} />
                <div ref={self} className={clsx(!userId && styles.disabled)}>
                    {translations.strings.save}
                </div>
            </div>
        </div>
    )
})
