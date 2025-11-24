import {useDispatch, useStore, useSelector} from "react-redux";
import type {AppDispatch, RootState, AppStore} from "@/store/store";

export const useAppDispatch = useDispatch.withTypes<AppDispatch>()
export const useAppSelector = useSelector.withTypes<RootState>()
export const useAppStore = useStore.withTypes<AppStore>()