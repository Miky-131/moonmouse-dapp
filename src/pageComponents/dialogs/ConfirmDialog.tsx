import { shrinkToValue } from '@/functions/shrinkToValue'
import useToggle from '@/hooks/useToggle'
import { ReactNode, RefObject, useCallback, useRef, useState } from 'react'
import { twMerge } from 'tailwind-merge'
import Button from '../../components/Button'
import Card from '../../components/Card'
import Col from '../../components/Col'
import Dialog from '../../components/Dialog'
import Icon, { AppHeroIconName } from '../../components/Icon'

export interface ConfirmDialogInfo {
  // eslint-disable-next-line @typescript-eslint/ban-types
  cardWidth?: 'md' | 'lg' | (string & {})

  type?: 'success' | 'warning' | 'error' | 'info' | 'no-head-icon'
  title?: ReactNode
  subtitle?: ReactNode
  description?: ReactNode | ((utils: { updateConfig: (newInfo: Partial<ConfirmDialogInfo>) => void }) => ReactNode)

  additionalContent?:
  | ReactNode
  | ((utils: { updateConfig: (newInfo: Partial<ConfirmDialogInfo>) => void }) => ReactNode)
  onlyConfirmButton?: boolean

  /** Defaultly cancel button is main button */
  confirmButtonIsMainButton?: boolean
  confirmButtonText?: ReactNode
  /** sometimes it has not load enough info to confirm */
  disableConfirmButton?: boolean
  disableAdditionalContent?: boolean
  cancelButtonText?: ReactNode
  onCancel?(): void
  onConfirm?(): void
}

const colors: Record<
  Exclude<ConfirmDialogInfo['type'], 'no-head-icon'> & string,
  { heroIconName: AppHeroIconName; ring: string; bg: string; text: string }
> = {
  success: {
    heroIconName: 'check-circle',
    ring: 'ring-[#D0D0D8]',
    text: 'text-color',
    bg: 'bg-[#D0D0D8]'
  },
  error: {
    heroIconName: 'exclamation-circle',
    ring: 'ring-[#f04a44]',
    text: 'text-[#f04a44]',
    bg: 'bg-[#e54bf9]'
  },
  info: {
    heroIconName: 'information-circle',
    ring: 'ring-[#2e7cf8]',
    text: 'text-[#2e7cf8]',
    bg: 'bg-[#92bcff]'
  },
  warning: {
    heroIconName: 'exclamation',
    ring: 'ring-[#7e7a2f]',
    text: 'text-[#7e7a2f]',
    bg: 'bg-[#7e7a2f]'
  }
}

export default function ConfirmDialog(rawProps: ConfirmDialogInfo & { domRef?: RefObject<HTMLDivElement> }) {
  const [props, setProps] = useState(rawProps)
  const [isOpen, { off: _close }] = useToggle(true)
  const hasConfirmed = useRef(false)

  const confirm = useCallback(() => {
    props.onConfirm?.()
    hasConfirmed.current = true
    _close()
  }, [_close])

  const close = useCallback(() => {
    _close()
    if (!hasConfirmed.current) props.onCancel?.()
  }, [_close])

  const controller = useRef({
    updateConfig(newInfo: Partial<ConfirmDialogInfo>) {
      setProps({ ...props, ...newInfo })
    }
  })

  return (
    <Dialog open={isOpen} onClose={close}>
      {({ close: closeDialog }) => (
        <Card
          className={twMerge(
            `p-8 rounded-3xl ${props.cardWidth === 'lg' ? 'w-[min(620px,95vw)]' : 'w-[min(360px,80vw)]'
            } mx-8 border-1.5 border-gray bg-light-card-bg shadow-cyberpunk-card`
          )}
          size="lg"
        >
          <Col className="items-center">
            {props.type !== 'no-head-icon' && (
              <Icon
                size="lg"
                heroIconName={colors[props.type ?? 'info'].heroIconName}
                className={`${colors[props.type ?? 'info'].text} mb-3`}
              />
            )}

            <div className="mb-6 text-center">
              <div className="font-semibold text-xl text-color mb-3">{props.title}</div>
              {props.subtitle && <div className="font-semibold text-xl text-color">{props.subtitle}</div>}
              {props.description && (
                <div className="font-normal text-base text-color">
                  {shrinkToValue(props.description, [controller.current])}
                </div>
              )}
            </div>

            <div className="self-stretch">
              {props.additionalContent ? (
                <div className="pb-4">{shrinkToValue(props.additionalContent, [controller.current])}</div>
              ) : undefined}
              <Col className="w-full">
                {!props.onlyConfirmButton && (
                  <Button
                    disabled={props.confirmButtonIsMainButton && props.disableConfirmButton}
                    className="text-color frosted-glass-skygray"
                    onClick={props.confirmButtonIsMainButton ? confirm : close}
                  >
                    {props.confirmButtonIsMainButton
                      ? props.confirmButtonText ?? 'OK'
                      : props.cancelButtonText ?? 'Cancel'}
                  </Button>
                )}
                <Button
                  disabled={!props.confirmButtonIsMainButton && props.disableConfirmButton}
                  className={`text-color ${props.onlyConfirmButton ? 'frosted-glass-skygray' : ''} text-sm ${!props.onlyConfirmButton ? '-mb-4' : ''
                    }`}
                  type="text"
                  onClick={props.confirmButtonIsMainButton ? close : confirm}
                >
                  {!props.confirmButtonIsMainButton
                    ? props.confirmButtonText ?? 'OK'
                    : props.cancelButtonText ?? 'Cancel'}
                </Button>
              </Col>
            </div>
          </Col>
        </Card>
      )}
    </Dialog>
  )
}
