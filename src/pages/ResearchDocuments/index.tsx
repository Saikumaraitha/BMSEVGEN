import { useEffect, useState } from 'react';
import { useParams, useNavigate, Outlet, useLocation } from 'react-router-dom';
import AppLayout from '../../layouts/AppLayout/AppLayout';
import ResearchDocumentsLayout from '../../layouts/ResearchDocumentsLayout/ResearchDocumentsLayout';
import { ROUTES } from '../../constants/routes';
import { getAssetDetails } from '../../services/home';
import type { Asset } from '../../types/home';

function ResearchDocuments() {
  const { assetId = '', indicationId = '' } = useParams<{ assetId: string; indicationId: string }>();
  const [asset, setAsset] = useState<Asset>();
  const navigate = useNavigate();
  const { state } = useLocation() as { state: { assetName?: string; indicationName?: string } | null };

  useEffect(() => {
    getAssetDetails(assetId).then(setAsset);
  }, [assetId]);

  const handleBack = () => navigate(ROUTES.HOME);

  return (
    <AppLayout>
      <ResearchDocumentsLayout
        assetName={asset?.name ?? state?.assetName}
        indicationName={asset?.indications?.find(i => i.id === indicationId)?.name ?? state?.indicationName}
        lastUpdated={asset?.lastUpdated}
        onBack={handleBack}
      >
        <Outlet />
      </ResearchDocumentsLayout>
    </AppLayout>
  );
}

export default ResearchDocuments;
