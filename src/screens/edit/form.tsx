import { clsx } from 'clsx'
import { observer } from 'mobx-react'
import * as React from 'react'

import styles from './form.module.scss'

import { data, translations } from '../../stores'

interface IFormProps {
    className?: string
}

function priceToText(price: number | string): string {
    if (typeof price !== 'number') {
        return price
    }

    return ` ${price}`.replace(/\./g, ',')
}

const priceReg = /^\s*\d+(,\d{0,2})?\s*$/

export const Form: React.FC<IFormProps> = observer((props) => {
    const { editId, all } = data

    const doCancel = React.useRef<HTMLButtonElement>(null)
    const doDelete = React.useRef<HTMLButtonElement>(null)
    const doSave = React.useRef<HTMLButtonElement>(null)

    const [confirm, setConfirm] = React.useState(false)

    const edit = React.useMemo(
        () => all.find((a) => a.id === editId) || { id: '', name: '', unit: 'kg', unitPrice: 1, variant: '' },
        [all, editId]
    )

    const setName = (ev: React.ChangeEvent<HTMLInputElement>): void => {
        setConfirm(false)

        edit.name = ev.target.value || ''
    }

    const setVariant = (ev: React.ChangeEvent<HTMLInputElement>): void => {
        setConfirm(false)

        edit.variant = ev.target.value || ''
    }

    const setUnit = (ev: React.ChangeEvent<HTMLInputElement>): void => {
        setConfirm(false)

        edit.unit = ev.target.value || ''
    }

    const setPrice = (ev: React.ChangeEvent<HTMLInputElement>): void => {
        setConfirm(false)

        edit.unitPrice = (ev.target.value || '') as unknown as number
    }

    const { name, unit, unitPrice } = edit

    const canSave = React.useMemo(
        () => name && unit && (typeof unitPrice === 'number' || priceReg.test(unitPrice)),
        [name, unit, unitPrice]
    )

    const onCancel = React.useCallback(() => (data.editId = undefined), [])

    const onSave = React.useCallback(() => data.addOrUpdate(edit), [edit])

    const onRemove = React.useCallback(() => {
        if (confirm) {
            data.remove(edit)
        } else {
            setConfirm(true)
        }
    }, [edit, confirm])

    return (
        <div className={clsx(styles.form, props.className)}>
            <h1>{translations.strings.form}</h1>
            <div>
                <label>
                    <span>{translations.strings.name}</span>
                    <input type='text' value={edit.name} onChange={setName} />
                </label>
                <label>
                    <span>{translations.strings.variant}</span>
                    <input type='text' value={edit.variant} onChange={setVariant} />
                </label>
                <label>
                    <span>
                        {translations.strings.price}
                        <input type='text' value={edit.unit} onChange={setUnit} />
                    </span>
                    <input size={4} type='text' value={priceToText(edit.unitPrice)} onChange={setPrice} />
                </label>
                <div>
                    <button ref={doCancel} onClick={onCancel}>
                        {translations.strings.cancel}
                    </button>
                    <button ref={doSave} disabled={!canSave} onClick={onSave}>
                        {translations.strings.save}
                    </button>
                    {editId && (
                        <button ref={doDelete} onClick={onRemove}>
                            {confirm ? translations.strings.confirm : translations.strings.remove}
                        </button>
                    )}
                </div>
            </div>
        </div>
    )
})
