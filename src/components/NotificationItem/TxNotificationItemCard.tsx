import useAppSettings from '@/application/common/useAppSettings'
import { useEvent } from '@/hooks/useEvent'
import { useHover } from '@/hooks/useHover'
import { useSignalState } from '@/hooks/useSignalState'
import useToggle from '@/hooks/useToggle'
import { produce } from 'immer'
import { RefObject, useEffect, useImperativeHandle, useRef } from 'react'
import Card from '../Card'
import Col from '../Col'
import Icon from '../Icon'
import LinkExplorer from '../LinkExplorer'
import LoadingCircleSmall from '../LoadingCircleSmall'
import Row from '../Row'
import { TxNotificationController, TxNotificationItemInfo } from './type'
import { spawnTimeoutControllers, TimeoutController } from './utils'
import useWallet from '@/application/wallet/useWallet'
import SquadsEmbeddedWalletAdapter from '../SolanaWallets/SquadsMultisig'

const existMs = process.env.NODE_ENV === 'development' ? 2 * 60 * 1000 : 15 * 1000 // (ms)

const colors = {
  success: {
    heroIconName: 'check-circle',
    ring: 'ring-[#1464ed]',
    text: 'text-[#1464ed]',
    bg: 'bg-[#1464ed]'
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
} as const

export function TxNotificationItemCard({
  info: { txInfos },
  componentRef,
  close
}: {
  componentRef: RefObject<any>
  info: TxNotificationItemInfo
  close: () => void
}) {
  const isMobile = useAppSettings((s) => s.isMobile)
  const explorerName = useAppSettings((s) => s.explorerName)
  const adapter = useWallet((s) => s.adapter)
  // cache for componentRef to change it
  const [innerTxInfos, setInnerTxInfos, innerTxInfosSignal] = useSignalState(txInfos)
  const wholeItemState = innerTxInfos.every(({ state }) => state === 'success')
    ? 'success'
    : innerTxInfos.some(({ state }) => state === 'error')
      ? 'error'
      : 'info'
  const isWholeStateSuccess = useEvent(() => wholeItemState === 'success')
  const totalTransactionLength = innerTxInfos.length
  const processedTransactionLength = innerTxInfos.filter(({ state }) => state === 'success' || state === 'error').length

  const timeoutController = useRef<TimeoutController>()

  useEffect(() => {
    const controller = spawnTimeoutControllers({
      onEnd: close,
      totalDuration: existMs
    })
    timeoutController.current = controller
    return controller.abort
  }, [close, existMs])

  const [isTimePassing, { off: pauseTimeline, on: resumeTimeline }] = useToggle(false)

  const itemRef = useRef<HTMLDivElement>(null)

  const isHovering = useHover(itemRef, {
    onHover({ is: now }) {
      if (!isWholeStateSuccess()) return
      if (now === 'start') {
        timeoutController.current?.pause()
        pauseTimeline()
      } else {
        timeoutController.current?.resume()
        resumeTimeline()
      }
    }
  })

  useEffect(() => {
    if (wholeItemState === 'success' && !isHovering) {
      timeoutController.current?.start()
      resumeTimeline()
    }
  }, [wholeItemState])

  useImperativeHandle(
    componentRef,
    () =>
    ({
      changeItemInfo(newInfo, options) {
        const targetTransaction = options.transaction
        const mutated = produce(innerTxInfosSignal(), (txInfos) => {
          const targetIdx = txInfos.findIndex(
            ({ transaction: candidateTransaction }) => candidateTransaction === targetTransaction
          )
          if (targetIdx < 0) {
            throw 'cannot get correct idx'
          }
          txInfos[targetIdx] = { ...txInfos[targetIdx], ...newInfo }
        })
        setInnerTxInfos(mutated)
      }
    } as TxNotificationController)
  )

  const successTitle =
    innerTxInfos[0].historyInfo.forceConfirmedTitle ??
    (adapter?.name === 'SquadsX'
      ? `Transaction initiated! (${innerTxInfos[0].historyInfo.title})`
      : `${innerTxInfos[0].historyInfo.title} Confirmed!`)

  const errorTitle =
    innerTxInfos[0].historyInfo.forceErrorTitle ??
    (adapter?.name === 'SquadsX'
      ? `Transaction initiation (${innerTxInfos[0].historyInfo.title}) failed!`
      : `${innerTxInfos[0].historyInfo.title} Error!`)

  const descriptionWhenProcessing = innerTxInfos[0].historyInfo.description

  const descriptionWhenSuccess =
    adapter?.name === 'SquadsX'
      ? `${innerTxInfos[0].historyInfo.description}
You can now cast votes for this proposal on the Squads app.`
      : innerTxInfos[0].historyInfo.description

  return (
    <Card
      domRef={itemRef}
      className={`min-w-[260px] relative rounded-xl ring-1.5 ring-inset ${colors[wholeItemState].ring} bg-[#1b242e] p-6 py-5 mx-4 my-2 overflow-hidden pointer-events-auto transition`}
    >
      {/* timeline */}
      <div className="h-1 absolute top-0 left-0 right-0">
        {/* track */}
        <div className={`opacity-5 ${colors[wholeItemState].bg} absolute inset-0 transition`} />
        {/* remain-line */}
        <div
          className={`${colors[wholeItemState].bg} absolute inset-0 py-`}
          style={{
            animation: `shrink ${existMs}ms linear forwards`,
            animationPlayState: isTimePassing ? 'running' : 'paused'
          }}
        />
      </div>

      <Icon
        size="smi"
        heroIconName="x"
        className="absolute right-3 top-4 clickable text-color opacity-50 mobile:opacity-100 hover:opacity-100 transition-opacity"
        onClick={() => {
          timeoutController.current?.abort()
          close()
        }}
      />
      <Row className="gap-3 px-2 mobile:px-0">
        <div>
          <Row className="gap-3 mb-3">
            <Icon heroIconName={colors[wholeItemState].heroIconName} className={colors[wholeItemState].text} />
            <div>
              <div className="font-medium text-base mobile:p-0 mobile:text-sm text-color">
                {wholeItemState === 'success'
                  ? successTitle
                  : wholeItemState === 'error'
                    ? errorTitle
                    : totalTransactionLength > 1
                      ? `Confirming transactions...(${processedTransactionLength}/${totalTransactionLength})`
                      : `Confirming transaction...`}
              </div>
              <div className="font-medium text-sm whitespace-pre-wrap mobile:text-sm text-color mt-1">
                {wholeItemState === 'success' ? descriptionWhenSuccess : descriptionWhenProcessing}
              </div>
            </div>
          </Row>
          <Col className="gap-2 mobile:gap-2 max-h-[252px] mobile:max-h-[140px] overflow-y-auto px-2 -mx-2 ">
            {innerTxInfos.map(({ state, txid, historyInfo }, idx) => (
              <Col key={idx}>
                <Row className="justify-between items-center p-3 gap-20 mobile:gap-1 bg-field rounded-lg">
                  <Row className="gap-1.5">
                    {/* item icon */}
                    <div>
                      {state === 'success' ? (
                        <Icon heroIconName="check-circle" size={isMobile ? 'sm' : 'smi'} className="text-[#1464ed]" />
                      ) : state === 'error' || state === 'aborted' ? (
                        <Icon
                          heroIconName="exclamation-circle"
                          size={isMobile ? 'sm' : 'smi'}
                          className="text-[#f04a44]"
                        />
                      ) : (
                        <LoadingCircleSmall className="h-5 w-5 mobile:h-4 mobile:w-4 scale-75" />
                      )}
                    </div>
                    {/* item text */}
                    <div className="text-sm mobile:text-xs font-medium text-color">
                      Transaction {idx + 1}
                      {historyInfo.subtransactionDescription ? `: ${historyInfo.subtransactionDescription}` : ''}
                    </div>
                  </Row>
                  <Row className="text-sm mobile:text-xs text-color gap-2">
                    {txid ? (
                      <Row className="items-center gap-1.5 opacity-50 mobile:opacity-100 hover:opacity-100 transition-opacity">
                        <div>
                          View on <LinkExplorer hrefDetail={`tx/${txid}`}>{explorerName}</LinkExplorer>
                        </div>
                        <Icon heroIconName="external-link" size="xs" className="text-color" />
                      </Row>
                    ) : (
                      <div className="text-color text-xs opacity-50 mobile:opacity-100 transition-opacity">
                        Waiting...
                      </div>
                    )}
                  </Row>
                </Row>

                {/* additional description text */}
              </Col>
            ))}
          </Col>
        </div>
      </Row>
    </Card>
  )
}
