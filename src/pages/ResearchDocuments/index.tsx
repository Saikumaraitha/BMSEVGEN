import { useEffect, useState } from 'react';
import { useParams, useNavigate, Outlet } from 'react-router-dom';
import AppLayout from '../../layouts/AppLayout/AppLayout';
import ResearchDocumentsLayout from '../../layouts/ResearchDocumentsLayout/ResearchDocumentsLayout';
import { ROUTES } from '../../constants/routes';
import { getAssetDetails } from '../../services/home';
import type { Asset } from '../../types/home';

function ResearchDocuments() {
  const { assetId = '' } = useParams<{ assetId: string }>();
  const [asset, setAsset] = useState<Asset>();
  const navigate = useNavigate();

  useEffect(() => {
    getAssetDetails(assetId).then(setAsset);
  }, [assetId]);

  const handleBack = () => navigate(ROUTES.HOME);

  return (
    <AppLayout>
      <ResearchDocumentsLayout
        assetName={asset?.name}
        lastUpdated={asset?.lastUpdated}
        onBack={handleBack}
      >
        <Outlet />
      </ResearchDocumentsLayout>
    </AppLayout>
  );
}

export default ResearchDocuments;
