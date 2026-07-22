import { type PaginationConfig } from 'antd/es/pagination';
import { usePathname, useRouter, useSearchParams } from 'next/navigation';

interface IUsePaginationProps extends PaginationConfig {
  current: number;
}

const usePagination = (): IUsePaginationProps => {
  const searchParams = useSearchParams();
  const pathname = usePathname();
  const { replace } = useRouter();

  const currentPage = Number(searchParams.get('page') || 1);

  const handleChangePage = (page: number) => {
    const params = new URLSearchParams(searchParams);
    params.set('page', page.toString());
    replace(`${pathname}?${params.toString()}`, { scroll: false });
  };

  return {
    onChange: handleChangePage,
    current: currentPage,
    hideOnSinglePage: true,
    showSizeChanger: false,
  };
};

export default usePagination;
