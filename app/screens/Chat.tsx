import {
  useBasicMessagesByConnectionId,
  useConnectionById,
  BasicMessageRecord,
  CredentialExchangeRecord,
  CredentialState,
  ProofExchangeRecord,
  ProofState,
  sendBasicMessage,
  BasicMessageRepository,
} from '@adeya/ssi'
import { StackScreenProps } from '@react-navigation/stack'
import React, { useCallback, useEffect, useMemo, useState } from 'react'
import { useTranslation } from 'react-i18next'
import { Linking, Text } from 'react-native'
import { GiftedChat, IMessage } from 'react-native-gifted-chat'
import { SafeAreaView } from 'react-native-safe-area-context'

import { isPresentationReceived } from '../../verifier'
import InfoIcon from '../components/buttons/InfoIcon'
import { renderComposer, renderInputToolbar, renderSend } from '../components/chat'
import ActionSlider from '../components/chat/ActionSlider'
import { renderActions } from '../components/chat/ChatActions'
import { ChatEvent } from '../components/chat/ChatEvent'
import { ChatMessage, ExtendedChatMessage, CallbackType } from '../components/chat/ChatMessage'
import { useNetwork } from '../contexts/network'
import { useStore } from '../contexts/store'
import { useTheme } from '../contexts/theme'
import { useCredentialsByConnectionId } from '../hooks/credentials'
import { useProofsByConnectionId } from '../hooks/proofs'
import { ColorPallet } from '../theme'
import { Role } from '../types/chat'
import { BasicMessageMetadata, basicMessageCustomMetadata } from '../types/metadata'
import { ContactStackParams, Screens, Stacks } from '../types/navigators'
import { useAppAgent } from '../utils/agent'
import { isW3CCredential } from '../utils/credential'
import {
  getCredentialEventLabel,
  getCredentialEventRole,
  getMessageEventRole,
  getProofEventLabel,
  getProofEventRole,
} from '../utils/helpers'

type ChatProps = StackScreenProps<ContactStackParams, Screens.Chat>

const Chat: React.FC<ChatProps> = ({ navigation, route }) => {
  if (!route?.params) {
    throw new Error('Chat route params were not set properly')
  }

  const { connectionId } = route.params
  const [store] = useStore()
  const { t } = useTranslation()
  const { agent } = useAppAgent()
  const connection = useConnectionById(connectionId)
  const basicMessages = useBasicMessagesByConnectionId(connectionId)
  const credentials = useCredentialsByConnectionId(connectionId)
  const proofs = useProofsByConnectionId(connectionId)
  const theirLabel = useMemo(() => connection?.theirLabel || connection?.id || '', [connection])
  const { assertConnectedNetwork, silentAssertConnectedNetwork } = useNetwork()
  const [messages, setMessages] = useState<Array<ExtendedChatMessage>>([])
  const [showActionSlider, setShowActionSlider] = useState(false)
  const { ChatTheme: theme, Assets } = useTheme()

  useMemo(() => {
    assertConnectedNetwork()
  }, [])

  useEffect(() => {
    navigation.setOptions({
      title: theirLabel,
      headerRight: () => <InfoIcon connectionId={connection?.id as string} />,
    })
  }, [connection])

  // when chat is open, mark messages as seen
  useEffect(() => {
    basicMessages.forEach(msg => {
      const meta = msg.metadata.get(BasicMessageMetadata.customMetadata) as basicMessageCustomMetadata
      if (agent && !meta?.seen) {
        msg.metadata.set(BasicMessageMetadata.customMetadata, { ...meta, seen: true })
        const basicMessageRepository = agent.context.dependencyManager.resolve(BasicMessageRepository)
        basicMessageRepository.update(agent.context, msg)
      }
    })
  }, [basicMessages])

  useEffect(() => {
    const transformedMessages: Array<ExtendedChatMessage> = basicMessages.map((record: BasicMessageRecord) => {
      const role = getMessageEventRole(record)
      const linkRegex = /(?:https?:\/\/[\w.-]+)|(?:[\w.-]+@[\w.-]+)/gm
      const mailRegex = /^[\w\d._-]+@\w+(?:\.\w+)+$/gm
      const links = record.content.match(linkRegex) ?? []
      const handleLinkPress = (link: string) => {
        if (link.match(mailRegex)) {
          link = 'mailto:' + link
        }
        Linking.openURL(link)
      }
      const msgText = (
        <Text style={role === Role.me ? theme.rightText : theme.leftText}>
          {record.content.split(linkRegex).map((split, i) => {
            if (i < links.length) {
              const link = links[i]
              return (
                <>
                  <Text>{split}</Text>
                  <Text
                    onPress={() => handleLinkPress(link)}
                    style={{ color: ColorPallet.brand.link, textDecorationLine: 'underline' }}
                    accessibilityRole={'link'}>
                    {link}
                  </Text>
                </>
              )
            }
            return <Text key={i.toString()}>{split}</Text>
          })}
        </Text>
      )
      return {
        _id: record.id,
        text: record.content,
        renderEvent: () => msgText,
        createdAt: record.updatedAt || record.createdAt,
        type: record.type,
        user: { _id: role },
      }
    })

    const callbackTypeForMessage = (record: CredentialExchangeRecord | ProofExchangeRecord) => {
      if (
        record instanceof CredentialExchangeRecord &&
        (record.state === CredentialState.Done || record.state === CredentialState.OfferReceived)
      ) {
        return CallbackType.CredentialOffer
      }

      if (
        (record instanceof ProofExchangeRecord && isPresentationReceived(record) && record.isVerified !== undefined) ||
        record.state === ProofState.RequestReceived ||
        (record.state === ProofState.Done && record.isVerified === undefined)
      ) {
        return CallbackType.ProofRequest
      }

      if (
        record instanceof ProofExchangeRecord &&
        (record.state === ProofState.PresentationSent || record.state === ProofState.Done)
      ) {
        return CallbackType.PresentationSent
      }
    }

    transformedMessages.push(
      ...credentials.map((record: CredentialExchangeRecord) => {
        const role = getCredentialEventRole(record)
        const userLabel = role === Role.me ? t('Chat.UserYou') : theirLabel
        const actionLabel = t(getCredentialEventLabel(record) as any)

        return {
          _id: record.id,
          text: actionLabel,
          renderEvent: () => <ChatEvent role={role} userLabel={userLabel} actionLabel={actionLabel} />,
          createdAt: record.updatedAt || record.createdAt,
          type: record.type,
          user: { _id: role },
          messageOpensCallbackType: callbackTypeForMessage(record),
          onDetails: () => {
            const navMap: { [key in CredentialState]?: () => void } = {
              [CredentialState.Done]: () => {
                navigation.navigate(Stacks.ContactStack as any, {
                  screen: isW3CCredential(record) ? Screens.CredentialDetailsW3C : Screens.CredentialDetails,
                  params: { credential: record },
                })
              },
              [CredentialState.OfferReceived]: () => {
                navigation.navigate(Stacks.ContactStack as any, {
                  screen: Screens.CredentialOffer,
                  params: { credentialId: record.id },
                })
              },
            }
            const nav = navMap[record.state]
            if (nav) {
              nav()
            }
          },
        }
      }),
    )

    transformedMessages.push(
      ...proofs.map((record: ProofExchangeRecord) => {
        const role = getProofEventRole(record)
        const userLabel = role === Role.me ? t('Chat.UserYou') : theirLabel
        const actionLabel = t(getProofEventLabel(record) as any)

        return {
          _id: record.id,
          text: actionLabel,
          renderEvent: () => <ChatEvent role={role} userLabel={userLabel} actionLabel={actionLabel} />,
          createdAt: record.updatedAt || record.createdAt,
          type: record.type,
          user: { _id: role },
          messageOpensCallbackType: callbackTypeForMessage(record),
          onDetails: () => {
            const toProofDetails = () => {
              navigation.navigate(Stacks.ContactStack as any, {
                screen: Screens.ProofDetails,
                params: {
                  recordId: record.id,
                  isHistory: true,
                  senderReview:
                    record.state === ProofState.PresentationSent ||
                    (record.state === ProofState.Done && record.isVerified === undefined),
                },
              })
            }
            const navMap: { [key in ProofState]?: () => void } = {
              [ProofState.Done]: toProofDetails,
              [ProofState.PresentationSent]: toProofDetails,
              [ProofState.PresentationReceived]: toProofDetails,
              [ProofState.RequestReceived]: () => {
                navigation.navigate(Stacks.ContactStack as any, {
                  screen: Screens.ProofRequest,
                  params: { proofId: record.id },
                })
              },
            }
            const nav = navMap[record.state]
            if (nav) {
              nav()
            }
          },
        }
      }),
    )

    const connectedMessage = connection
      ? {
          _id: 'connected',
          text: `${t('Chat.YouConnected')} ${theirLabel}`,
          renderEvent: () => (
            <Text style={theme.rightText}>
              {t('Chat.YouConnected')}
              <Text style={[theme.rightText, theme.rightTextHighlighted]}> {theirLabel}</Text>
            </Text>
          ),
          createdAt: connection.createdAt,
          user: { _id: Role.me },
        }
      : undefined

    setMessages(
      connectedMessage
        ? [...transformedMessages.toSorted((a: any, b: any) => b.createdAt - a.createdAt), connectedMessage]
        : transformedMessages.toSorted((a: any, b: any) => b.createdAt - a.createdAt),
    )
  }, [basicMessages, credentials, proofs, theirLabel])

  const onSend = useCallback(
    async (messages: IMessage[]) => {
      await sendBasicMessage(agent, connectionId, messages[0].text)
    },
    [agent, connectionId],
  )

  const onSendRequest = useCallback(async () => {
    navigation.navigate(Stacks.ProofRequestsStack as any, {
      screen: Screens.ProofRequests,
      params: { navigation: navigation, connectionId },
    })
  }, [navigation, connectionId])

  const actions = useMemo(() => {
    return store.preferences.useVerifierCapability
      ? [
          {
            text: t('Verifier.SendProofRequest'),
            onPress: () => {
              setShowActionSlider(false)
              onSendRequest()
            },
            icon: () => <Assets.svg.iconInfoSentDark height={30} width={30} />,
          },
        ]
      : undefined
  }, [t, store.preferences.useVerifierCapability, onSendRequest])

  const onDismiss = () => {
    setShowActionSlider(false)
  }

  return (
    <SafeAreaView edges={['bottom', 'left', 'right']} style={{ flex: 1, paddingTop: 20 }}>
      <GiftedChat
        messages={messages}
        showAvatarForEveryMessage={true}
        alignTop
        renderAvatar={() => null}
        messageIdGenerator={msg => msg?._id.toString() || '0'}
        renderMessage={props => <ChatMessage messageProps={props} />}
        renderInputToolbar={props => renderInputToolbar(props, theme)}
        renderSend={props => renderSend(props, theme)}
        renderComposer={props => renderComposer(props, theme, t('Contacts.TypeHere'))}
        disableComposer={!silentAssertConnectedNetwork()}
        onSend={onSend}
        user={{
          _id: Role.me,
        }}
        renderActions={props => renderActions(props, theme, actions)}
        onPressActionButton={() => setShowActionSlider(true)}
      />
      {showActionSlider && <ActionSlider onDismiss={onDismiss} actions={actions} />}
    </SafeAreaView>
  )
}

export default Chat
