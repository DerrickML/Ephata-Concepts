import {
  AtSign,
  BriefcaseBusiness,
  Camera,
  Code2,
  Globe2,
  Link,
  MessageCircle,
  MessagesSquare,
  Music2,
  Pin,
  Play,
  Podcast,
  Radio,
  Send,
  Users,
  Video
} from "lucide-react";

const ICONS = {
  "at-sign": AtSign,
  briefcase: BriefcaseBusiness,
  camera: Camera,
  code: Code2,
  globe: Globe2,
  link: Link,
  "message-circle": MessageCircle,
  messages: MessagesSquare,
  music: Music2,
  pin: Pin,
  play: Play,
  podcast: Podcast,
  radio: Radio,
  send: Send,
  users: Users,
  video: Video
};

export default function SocialIcon({ name, size = 18, ...props }) {
  const Icon = ICONS[name] || Link;
  return <Icon size={size} {...props} />;
}
