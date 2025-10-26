import Skeleton from "react-loading-skeleton";
import "react-loading-skeleton/dist/skeleton.css";
import "./DetailSkeleton.css";

const DetailSkeleton = () => {
  return (
    <div className="detail-skeleton-container fade-in">
      <div className="skeleton-header">
        <div className="skeleton-header-left">
          <Skeleton width={200} height={32} />
          <Skeleton width={300} height={16} style={{ marginTop: 8 }} />
        </div>
        <div className="skeleton-header-actions">
          <Skeleton width={100} height={40} borderRadius={10} />
          <Skeleton width={120} height={40} borderRadius={10} />
        </div>
      </div>

      <div className="detail-skeleton-card">
        {/* Header del card */}
        <div className="detail-skeleton-header">
          <Skeleton width={250} height={28} />
          <Skeleton width={80} height={24} style={{ marginTop: 8 }} />
        </div>

        {/* Campos de detalle */}
        <div className="detail-skeleton-content">
          {Array(4)
            .fill(0)
            .map((_, index) => (
              <div key={index} className="detail-skeleton-row">
                <Skeleton width={120} height={16} />
                <Skeleton width="70%" height={18} />
              </div>
            ))}
        </div>

        {/* Botón de acción */}
        <div className="detail-skeleton-actions">
          <Skeleton width={180} height={40} borderRadius={10} />
        </div>
      </div>
    </div>
  );
};

export default DetailSkeleton;
