import ecc from "eosjs-ecc"

const AVATAR_URL_BASE = "https://api.adorable.io/avatars/face"
const eyes = ["eyes1", "eyes2", "eyes3", "eyes4", "eyes5", "eyes6", "eyes7", "eyes8", "eyes9"]
const nose = ["nose1", "nose2", "nose3", "nose4", "nose5", "nose6", "nose7", "nose8", "nose9"]
const mouse = [
  "mouth1",
  "mouth2",
  "mouth3",
  "mouth4",
  "mouth5",
  "mouth6",
  "mouth7",
  "mouth8",
  "mouth9"
]

export const generateAvatarURL = author => {
  const hash = ecc.sha256(author)
  const indexForPerson = parseInt(hash, 16) % 10

  const targetEye = eyes[indexForPerson]
  const targetNose = nose[indexForPerson]
  const targetMouse = mouse[indexForPerson]
  return AVATAR_URL_BASE + ":" + targetEye + ":" + targetNose + ":" + targetMouse
}
