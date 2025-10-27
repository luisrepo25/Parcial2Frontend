import Skeleton from "react-loading-skeleton";
import "react-loading-skeleton/dist/skeleton.css";

const FormSkeleton = () => {
  return (
    <div className="form-skeleton-container fade-in">
      <div className="skeleton-header">
        <div className="skeleton-header-left">
          <Skeleton width={250} height={32} />
          <Skeleton width={400} height={16} style={{ marginTop: 8 }} />
        </div>
      </div>

      <div className="form-skeleton-card">
        {/* Campo 1 */}
        <div className="form-skeleton-group">
          <Skeleton width={120} height={16} style={{ marginBottom: 8 }} />
          <Skeleton height={42} borderRadius={12} />
        </div>

        {/* Campo 2 */}
        <div className="form-skeleton-group">
          <Skeleton width={100} height={16} style={{ marginBottom: 8 }} />
          <Skeleton height={120} borderRadius={12} />
        </div>

        {/* Botones */}
        <div className="form-skeleton-actions">
          <Skeleton width={120} height={40} borderRadius={10} />
          <Skeleton width={150} height={40} borderRadius={10} />
        </div>
      </div>
    </div>
  );
};

export default FormSkeleton;
