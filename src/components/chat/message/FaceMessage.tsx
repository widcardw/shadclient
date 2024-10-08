import { Skeleton } from '@/components/ui/skeleton'
import type {
  CommonFaceMessage,
  CommonMFaceMessage,
  CommonMarketFaceMessage,
} from '@/libs/types/messages/common-message'
import { type Component, Show, createSignal } from 'solid-js'
import { useImage } from 'solidjs-use'

const CQ_FACE_BASE_URL =
  'https://cdn.jsdelivr.net/gh/Yan-Zero/QFace@master/gif/s'
const KOISHI_QFACE_BASE_URL = 'https://koishi.js.org/QFace/gif/s'

const FaceMessage: Component<{ m: CommonFaceMessage }> = (props) => {
  const [imgOptions] = createSignal({
    src: `${KOISHI_QFACE_BASE_URL}${props.m.data.id}.gif`,
  })
  const { isLoading, error } = useImage(imgOptions)

  return (
    <Show
      when={!isLoading()}
      fallback={
        <Skeleton
          class="w-5 h-5 rounded-full inline-block vertical-middle"
          style={{ 'box-sizing': 'border-box' }}
        />
      }
    >
      <Show when={!error()} fallback={<>[表情:{props.m.data.id}]</>}>
        <img
          class="w-5 h-5 inline-block vertical-middle"
          style={{ 'box-sizing': 'border-box' }}
          src={imgOptions().src}
        />
      </Show>
    </Show>
  )
}

const MarketFaceMessage: Component<{ m: CommonMarketFaceMessage }> = (
  props,
) => {
  return <>{props.m.data.summary}</>
}

const MFaceMessage: Component<{ m: CommonMFaceMessage }> = (props) => {
  const [imgOptions] = createSignal({ src: props.m.data.url })
  const { isLoading, error } = useImage(imgOptions)
  return (
    <Show when={!error()} fallback={props.m.data.summary}>
      <Show
        when={!isLoading()}
        fallback={
          <Skeleton
            class="w-20 h-20 rounded-full inline-block vertical-middle"
            style={{ 'box-sizing': 'border-box' }}
          />
        }
      >
        <img class="w-20 h-20" src={imgOptions().src} style={{ 'box-sizing': 'border-box' }} />
      </Show>
    </Show>
  )
}

const CQ_FACE_IDS = [
  0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 16, 18, 19, 20, 21, 22, 23,
  24, 25, 26, 27, 28, 29, 30, 31, 32, 33, 34, 35, 37, 38, 39, 42, 43, 46, 49,
  53, 54, 55, 56, 57, 59, 60, 61, 63, 64, 66, 67, 69, 74, 75, 76, 77, 78, 79,
  86, 89, 96, 97, 98, 99, 100, 101, 102, 103, 104, 105, 106, 107, 108, 109, 110,
  111, 112, 113, 114, 115, 116, 117, 118, 119, 120, 121, 122, 123, 124, 125,
  126, 127, 128, 129, 130, 131, 132, 133, 134, 136, 137, 138, 140, 144, 145,
  146, 147, 148, 151, 158, 168, 169, 171, 172, 173, 174, 175, 176, 177, 178,
  179, 180, 181, 182, 183, 184, 185, 187, 188, 190, 192, 194, 197, 198, 199,
  200, 201, 202, 203, 204, 205, 206, 207, 208, 210, 211, 212, 214, 215, 216,
  217, 218, 219, 220, 221, 222, 223, 224, 225, 226, 227, 228, 229, 230, 231,
  232, 233, 234, 235, 236, 237, 238, 239, 240, 241, 242, 243, 244, 245, 246,
  247, 260, 261, 262, 263, 264, 265, 266, 267, 268, 269, 270, 271, 272, 273,
  274, 276, 277, 278, 279, 280, 281, 282, 283, 284, 285, 286, 287, 288, 289,
  290, 291, 292, 293, 294, 295, 296, 297, 298, 299, 300, 301, 302, 303, 304,
  305, 306, 307, 308, 309, 310, 311, 312, 313, 314, 315, 316, 317, 318, 319,
  320, 321, 322, 323, 324, 325, 326, 327, 328, 329, 330, 331, 332, 337, 338,
  339, 340, 341, 342, 343, 344, 345, 346,
]

export {
  FaceMessage,
  MarketFaceMessage,
  MFaceMessage,
  CQ_FACE_BASE_URL,
  KOISHI_QFACE_BASE_URL,
  CQ_FACE_IDS,
}
