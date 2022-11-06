import { clsx } from 'clsx'
import { observer } from 'mobx-react'
import * as React from 'react'

import styles from './logon.module.scss'

import { Button } from '../../components/button'
import { data, translations } from '../../stores'

interface ILogonProps {
    className?: string
}

export const Logon: React.FC<ILogonProps> = observer((props) => {
    const [userId, setUserId] = React.useState('')

    const onChange = (ev: React.ChangeEvent<HTMLInputElement>): void => setUserId(ev.currentTarget.value)

    const onClick = React.useCallback(() => (data.userId = userId), [userId])

    return (
        <div className={clsx(styles.logon, props.className)}>
            <div>
                <div>{translations.strings.logon}</div>
                <input type='text' value={userId} onChange={onChange} />
                <Button disabled={!userId} onClick={onClick}>
                    {translations.strings.save}
                </Button>
            </div>
        </div>
    )
})
