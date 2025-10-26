import Skeleton from "react-loading-skeleton";
import "react-loading-skeleton/dist/skeleton.css";
import "./TableSkeleton.css";

interface TableSkeletonProps {
  rows?: number;
  columns?: number;
}

const TableSkeleton = ({ rows = 5, columns = 5 }: TableSkeletonProps) => {
  return (
    <div className="skeleton-container fade-in">
      <div className="skeleton-header">
        <div className="skeleton-header-left">
          <Skeleton width={200} height={32} />
          <Skeleton width={300} height={16} style={{ marginTop: 8 }} />
        </div>
        <Skeleton width={150} height={40} borderRadius={10} />
      </div>

      <div className="skeleton-table">
        <div className="skeleton-table-header">
          {Array(columns)
            .fill(0)
            .map((_, i) => (
              <div key={i} className="skeleton-table-cell">
                <Skeleton width="80%" height={20} />
              </div>
            ))}
        </div>

        {Array(rows)
          .fill(0)
          .map((_, rowIndex) => (
            <div key={rowIndex} className="skeleton-table-row">
              {Array(columns)
                .fill(0)
                .map((_, colIndex) => (
                  <div key={colIndex} className="skeleton-table-cell">
                    <Skeleton width="90%" height={16} />
                  </div>
                ))}
            </div>
          ))}
      </div>
    </div>
  );
};

export default TableSkeleton;
