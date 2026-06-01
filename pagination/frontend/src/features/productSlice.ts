import { createSlice, createAsyncThunk, PayloadAction } from '@reduxjs/toolkit';

interface Product {
  _id: string;
  title: string;
  price: number;
  category: string;
}

interface FetchProductsResponse {
  products: Product[];
  currentPage: number;
  totalPages: number;
}

interface ProductState {
  pages: { [key: number]: Product[] };
  currentPage: number;
  totalPages: number;
  filteredProducts: Product[];
  currentCategory: string;
  loading: boolean;
}

const initialState: ProductState = {
  pages: {},
  currentPage: 1,
  totalPages: 1,
  filteredProducts: [],
  currentCategory: 'all',
  loading: false,
};

export const fetchProductsPage = createAsyncThunk(
  'products/fetchPage',
  async (page: number) => {
    const response = await fetch(`http://localhost:5000/products?page=${page}&limit=5`);
    const data: FetchProductsResponse = await response.json();
    return data;
  }
);

export const fetchProductsByCategory = createAsyncThunk(
  'products/fetchByCategory',
  async (category: string) => {
    const response = await fetch(`http://localhost:5000/products/category/${category}`);
    const data = await response.json();
    return { products: data.products, category };
  }
);

const productSlice = createSlice({
  name: 'products',
  initialState,
  reducers: {
    setPage: (state, action: PayloadAction<number>) => {
      state.currentPage = action.payload;
    },
    resetCategory: (state) => {
      state.currentCategory = 'all';
      state.filteredProducts = [];
    }
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchProductsPage.pending, (state) => {
        state.loading = true;
      })
      .addCase(fetchProductsPage.fulfilled, (state, action: PayloadAction<FetchProductsResponse>) => {
        state.loading = false;
        const { products, currentPage, totalPages } = action.payload;
        state.pages[currentPage] = products;
        state.currentPage = currentPage;
        state.totalPages = totalPages;
      })
      .addCase(fetchProductsByCategory.pending, (state) => {
        state.loading = true;
      })
      .addCase(fetchProductsByCategory.fulfilled, (state, action) => {
        state.loading = false;
        state.filteredProducts = action.payload.products;
        state.currentCategory = action.payload.category;
      });
  },
});

export const { setPage, resetCategory } = productSlice.actions;
export default productSlice.reducer;