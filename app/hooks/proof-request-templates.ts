import { useEffect, useState } from 'react'

import { ProofRequestTemplate } from '../../verifier'
import { useConfiguration } from '../contexts/configuration'
import { applyTemplateMarkers, useRemoteProofBundleResolver } from '../utils/proofBundle'

export const useTemplates = (): Array<ProofRequestTemplate> => {
  const [proofRequestTemplates, setProofRequestTemplates] = useState<ProofRequestTemplate[]>([])
  const { proofTemplateBaseUrl } = useConfiguration()
  const resolver = useRemoteProofBundleResolver(proofTemplateBaseUrl)
  const acceptDevCredentials = false
  useEffect(() => {
    resolver.resolve(acceptDevCredentials).then(templates => {
      if (templates) {
        setProofRequestTemplates(applyTemplateMarkers(templates))
      }
    })
  }, [])
  return proofRequestTemplates
}

export const useTemplate = (templateId: string): ProofRequestTemplate | undefined => {
  const [proofRequestTemplate, setProofRequestTemplate] = useState<ProofRequestTemplate | undefined>(undefined)
  const { proofTemplateBaseUrl } = useConfiguration()
  const resolver = useRemoteProofBundleResolver(proofTemplateBaseUrl)
  const acceptDevCredentials = false

  useEffect(() => {
    resolver.resolveById(templateId, acceptDevCredentials).then(template => {
      if (template) {
        setProofRequestTemplate(applyTemplateMarkers(template))
      }
    })
  }, [])
  return proofRequestTemplate
}
