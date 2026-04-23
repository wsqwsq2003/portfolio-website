import { createContext, useContext, useState, useCallback, useEffect, type ReactNode } from "react"
import type { Locale } from "./i18n/types"
import { fetchContent, saveContent as saveToServer, isServerAvailable } from "./api"
import { initWebSocket, onContentUpdate, offContentUpdate } from "./websocket"

// ---- Editable data types (language-independent structure) ----

export interface EditableStat {
  value: string
  label: string
}

export interface EditablePersonal {
  name: string
  title: string
  tagline: string
  about: string
  avatarUrl: string
  stats: EditableStat[]
}

export interface EditableEducation {
  school: string
  degree: string
  major: string
  period: string
  description: string
  gpa: string
}

export interface EditableExperience {
  company: string
  role: string
  period: string
  description: string[]
  tags: string[]
}

export interface EditableHobby {
  name: string
  description: string
  iconKey: string
  image: string
  detail: string
}

export interface EditableActivity {
  title: string
  role: string
  period: string
  description: string
  iconKey: string
}

export interface EditableContact {
  email: string
  phone: string
  location: string
}

export interface EditableProject {
  name: string
  role: string
  period: string
  description: string
  technologies: string[]
  image: string
  link: string
  detail: string
}

export interface SiteContent {
  personal: EditablePersonal
  education: EditableEducation[]
  internships: EditableExperience[]
  work: EditableExperience[]
  projects: EditableProject[]
  hobbies: EditableHobby[]
  activities: EditableActivity[]
  contact: EditableContact
}

// ---- Defaults per language ----

const defaultZh: SiteContent = {
  personal: {
    name: "张明",
    title: "全栈开发工程师",
    tagline: "热爱技术，追求卓越，用代码创造价值",
    about: "我是一名充满热情的全栈开发工程师，拥有扎实的计算机科学基础和丰富的项目实践经验。擅长使用 React、Vue、Spring Boot 等主流技术栈进行开发，对分布式系统、微服务架构有深入理解。始终保持学习的热情，关注前沿技术动态，致力于构建高质量、可维护的软件产品。",
    avatarUrl: "/images/avatar.png",
    stats: [
      { value: "3+", label: "工作经验" },
      { value: "10+", label: "技术栈" },
      { value: "500+", label: "开源贡献" },
      { value: "50+", label: "团队协作" },
    ],
  },
  education: [
    { school: "北京大学", degree: "master", major: "计算机科学与技术", period: "2020.09 - 2023.06", description: "研究方向为分布式系统与云计算，参与国家级科研项目2项，发表SCI论文1篇。获得研究生国家奖学金、优秀毕业生等荣誉。", gpa: "3.85/4.0" },
    { school: "武汉大学", degree: "bachelor", major: "软件工程", period: "2016.09 - 2020.06", description: "主修软件工程核心课程，包括数据结构、算法设计、操作系统、计算机网络等。连续三年获得校级奖学金，毕业设计获评优秀。", gpa: "3.78/4.0" },
  ],
  internships: [
    { company: "字节跳动", role: "前端开发实习生", period: "2022.06 - 2022.09", description: ["参与抖音电商后台管理系统开发，负责商品管理模块的前端实现", "使用 React + TypeScript 重构旧版 jQuery 页面，提升页面性能 40%", "设计并实现通用组件库中的表格组件，支持虚拟滚动和动态列配置", "编写单元测试，测试覆盖率达到 85% 以上"], tags: ["React", "TypeScript", "Ant Design", "Jest"] },
    { company: "腾讯", role: "后端开发实习生", period: "2021.07 - 2021.10", description: ["参与微信支付核心系统的性能优化项目", "使用 Go 语言开发微服务接口，处理日均千万级请求", "优化 Redis 缓存策略，将接口响应时间降低 30%", "参与代码审查，编写技术文档和接口文档"], tags: ["Go", "Redis", "gRPC", "Docker"] },
  ],
  work: [
    { company: "阿里巴巴", role: "高级全栈开发工程师", period: "2023.07 - 至今", description: ["负责淘宝商家中台核心模块的架构设计与开发", "主导前端微前端架构升级，将单体应用拆分为10+独立子应用", "设计高可用分布式任务调度系统，支撑日均亿级数据处理", "指导初级工程师，组织团队技术分享，推动团队技术成长"], tags: ["React", "Spring Boot", "Kubernetes", "微前端"] },
  ],
  projects: [
    { name: "智能校园平台", role: "全栈开发", period: "2023.01 - 2023.06", description: "开发集成课程管理、校园导航、失物招领功能的智慧校园应用，服务全校师生。", technologies: ["React", "Node.js", "MongoDB", "WebSocket"], image: "", link: "", detail: "项目采用前后端分离架构，前端使用 React 构建响应式界面，后端基于 Node.js + Express 提供 RESTful API。实现了实时消息推送、地图导航、课程表同步等核心功能。项目获得全国大学生科技创新大赛二等奖。" },
    { name: "电商数据分析系统", role: "前端负责人", period: "2022.07 - 2022.12", description: "构建可视化数据分析平台，帮助商家实时监控销售数据、用户行为和市场趋势。", technologies: ["Vue.js", "ECharts", "Python", "Flask"], image: "", link: "", detail: "系统支持多维度数据筛选、自定义报表生成、实时数据刷新等功能。使用 ECharts 实现丰富的图表展示，包括折线图、柱状图、热力图等。后端使用 Python Flask 处理数据聚合和分析。" },
    { name: "开源 UI 组件库", role: "核心开发者", period: "2021.09 - 至今", description: "参与开发高质量 React UI 组件库，提供 50+ 可复用组件，获得 500+ GitHub Stars。", technologies: ["React", "TypeScript", "Storybook", "Rollup"], image: "", link: "", detail: "组件库遵循 Material Design 设计规范，支持主题定制、按需导入、TypeScript 类型推导等特性。使用 Storybook 进行组件开发和文档展示，通过 Rollup 打包优化构建体积。" },
  ],
  hobbies: [
    { name: "编程", description: "热衷于探索新技术，参与开源项目贡献", iconKey: "Code2", image: "https://images.unsplash.com/photo-1461749280684-dccba630e2f6?w=600&h=400&fit=crop", detail: "" },
    { name: "阅读", description: "喜欢阅读技术书籍和科幻小说", iconKey: "BookOpen", image: "https://images.unsplash.com/photo-1512820790803-83ca734da794?w=600&h=400&fit=crop", detail: "" },
    { name: "摄影", description: "用镜头记录生活中的美好瞬间", iconKey: "Camera", image: "https://images.unsplash.com/photo-1516035069371-29a1b244cc32?w=600&h=400&fit=crop", detail: "" },
    { name: "音乐", description: "吉他爱好者，偶尔创作原创音乐", iconKey: "Music", image: "https://images.unsplash.com/photo-1510915361894-db8b60106cb1?w=600&h=400&fit=crop", detail: "" },
    { name: "健身", description: "坚持每周运动，保持健康体魄", iconKey: "Dumbbell", image: "https://images.unsplash.com/photo-1534438327276-14e5300c3a48?w=600&h=400&fit=crop", detail: "" },
    { name: "旅行", description: "探索不同城市的文化与风景", iconKey: "Plane", image: "https://images.unsplash.com/photo-1488646953014-85cb44e25828?w=600&h=400&fit=crop", detail: "" },
  ],
  activities: [
    { title: "ACM 程序设计竞赛", role: "队长", period: "2018.03 - 2019.11", description: "带领三人团队参加 ACM-ICPC 亚洲区域赛，获得银牌。负责算法策略制定和团队训练计划安排。", iconKey: "Award" },
    { title: "计算机学院学生会", role: "技术部部长", period: "2017.09 - 2019.06", description: "组织校园编程马拉松、技术讲座等活动10余场，参与人数累计超过2000人。搭建学院线上活动平台。", iconKey: "Users" },
    { title: "开源社区贡献", role: "核心贡献者", period: "2019.01 - 至今", description: "在 GitHub 上积极参与开源项目，累计获得 500+ Star。主要贡献于前端工具链和 UI 组件库项目。", iconKey: "Github" },
    { title: "校园科技创新大赛", role: "项目负责人", period: "2019.03 - 2019.12", description: "带领团队开发智慧校园 App，集成课程管理、校园导航、失物招领等功能。获全国二等奖。", iconKey: "Calendar" },
  ],
  contact: { email: "zhangming@example.com", phone: "+86 138-0000-0000", location: "杭州市, 浙江省" },
}

const defaultEn: SiteContent = {
  personal: { name: "Ming Zhang", title: "Full-Stack Developer", tagline: "Passionate about technology, committed to excellence, creating value through code", about: "I'm a passionate full-stack developer with a solid computer science foundation and extensive project experience. Proficient in React, Vue, Spring Boot and other mainstream tech stacks, with deep understanding of distributed systems and microservices architecture. Always eager to learn, following cutting-edge technology trends, and dedicated to building high-quality, maintainable software products.", avatarUrl: "/images/avatar.png", stats: [
    { value: "3+", label: "Years Experience" },
    { value: "10+", label: "Tech Stack" },
    { value: "500+", label: "Open Source Contributions" },
    { value: "50+", label: "Team Collaborations" },
  ] },
  education: [
    { school: "Peking University", degree: "master", major: "Computer Science", period: "2020.09 - 2023.06", description: "Research focus on distributed systems and cloud computing. Participated in 2 national research projects, published 1 SCI paper. National Scholarship and Outstanding Graduate.", gpa: "3.85/4.0" },
    { school: "Wuhan University", degree: "bachelor", major: "Software Engineering", period: "2016.09 - 2020.06", description: "Core courses in data structures, algorithm design, OS, and computer networks. Received university-level scholarships for 3 consecutive years.", gpa: "3.78/4.0" },
  ],
  internships: [
    { company: "ByteDance", role: "Frontend Intern", period: "2022.06 - 2022.09", description: ["Developed product management module for Douyin E-commerce admin system", "Refactored legacy jQuery pages using React + TypeScript, improving performance by 40%", "Built reusable table component with virtual scrolling and dynamic columns", "Wrote unit tests achieving 85%+ code coverage"], tags: ["React", "TypeScript", "Ant Design", "Jest"] },
    { company: "Tencent", role: "Backend Intern", period: "2021.07 - 2021.10", description: ["Participated in WeChat Pay core system performance optimization", "Developed microservice APIs in Go handling 10M+ daily requests", "Optimized Redis caching strategy, reducing response time by 30%", "Contributed to code reviews and technical documentation"], tags: ["Go", "Redis", "gRPC", "Docker"] },
  ],
  work: [
    { company: "Alibaba", role: "Senior Full-Stack Developer", period: "2023.07 - Present", description: ["Led architecture design and development of Taobao merchant platform core modules", "Drove micro-frontend migration, splitting monolith into 10+ independent sub-apps", "Designed highly-available distributed task scheduling system for billion-level daily data processing", "Mentored junior engineers and organized team tech sharing sessions"], tags: ["React", "Spring Boot", "Kubernetes", "Micro-Frontend"] },
  ],
  projects: [
    { name: "Smart Campus Platform", role: "Full-Stack Developer", period: "2023.01 - 2023.06", description: "Developed a comprehensive campus application integrating course management, navigation, and lost & found features for teachers and students.", technologies: ["React", "Node.js", "MongoDB", "WebSocket"], image: "", link: "", detail: "The project采用 a decoupled frontend-backend architecture. Frontend built with React for responsive UI, backend based on Node.js + Express providing RESTful APIs. Implemented real-time messaging, map navigation, course schedule sync and core features. Won 2nd prize in National College Student Tech Innovation Competition." },
    { name: "E-Commerce Analytics System", role: "Frontend Lead", period: "2022.07 - 2022.12", description: "Built a visual data analytics platform helping merchants monitor sales data, user behavior and market trends in real-time.", technologies: ["Vue.js", "ECharts", "Python", "Flask"], image: "", link: "", detail: "System supports multi-dimensional data filtering, custom report generation, real-time data refresh. Uses ECharts for rich chart display including line charts, bar charts, heatmaps. Backend uses Python Flask for data aggregation and analysis." },
    { name: "Open Source UI Component Library", role: "Core Developer", period: "2021.09 - Present", description: "Contributed to high-quality React UI component library with 50+ reusable components, earning 500+ GitHub Stars.", technologies: ["React", "TypeScript", "Storybook", "Rollup"], image: "", link: "", detail: "Component library follows Material Design guidelines, supports theme customization, on-demand import, TypeScript type inference. Uses Storybook for component development and documentation, Rollup for optimized build size." },
  ],
  hobbies: [
    { name: "Coding", description: "Passionate about exploring new technologies and contributing to open source", iconKey: "Code2", image: "https://images.unsplash.com/photo-1461749280684-dccba630e2f6?w=600&h=400&fit=crop", detail: "" },
    { name: "Reading", description: "Love tech books and sci-fi novels", iconKey: "BookOpen", image: "https://images.unsplash.com/photo-1512820790803-83ca734da794?w=600&h=400&fit=crop", detail: "" },
    { name: "Photography", description: "Capturing beautiful moments through the lens", iconKey: "Camera", image: "https://images.unsplash.com/photo-1516035069371-29a1b244cc32?w=600&h=400&fit=crop", detail: "" },
    { name: "Music", description: "Guitar enthusiast, occasional songwriter", iconKey: "Music", image: "https://images.unsplash.com/photo-1510915361894-db8b60106cb1?w=600&h=400&fit=crop", detail: "" },
    { name: "Fitness", description: "Weekly workout routine for a healthy lifestyle", iconKey: "Dumbbell", image: "https://images.unsplash.com/photo-1534438327276-14e5300c3a48?w=600&h=400&fit=crop", detail: "" },
    { name: "Travel", description: "Exploring cultures and landscapes of different cities", iconKey: "Plane", image: "https://images.unsplash.com/photo-1488646953014-85cb44e25828?w=600&h=400&fit=crop", detail: "" },
  ],
  activities: [
    { title: "ACM Programming Contest", role: "Team Captain", period: "2018.03 - 2019.11", description: "Led a 3-person team in ACM-ICPC Asia Regional, winning Silver Medal. Responsible for algorithm strategy and training schedule.", iconKey: "Award" },
    { title: "CS Student Council", role: "Tech Director", period: "2017.09 - 2019.06", description: "Organized 10+ events including hackathons and tech talks with 2000+ total participants. Built an online event platform.", iconKey: "Users" },
    { title: "Open Source Community", role: "Core Contributor", period: "2019.01 - Present", description: "Active GitHub contributor with 500+ stars. Main contributions to frontend tooling and UI component libraries.", iconKey: "Github" },
    { title: "Campus Tech Innovation", role: "Project Lead", period: "2019.03 - 2019.12", description: "Led development of a Smart Campus App integrating course management, navigation, and lost & found. Won national 2nd prize.", iconKey: "Calendar" },
  ],
  contact: { email: "zhangming@example.com", phone: "+86 138-0000-0000", location: "Hangzhou, Zhejiang, China" },
}

const defaultJa: SiteContent = {
  personal: { name: "張明", title: "フルスタック開発エンジニア", tagline: "技術を愛し、卓越を追求し、コードで価値を創造する", about: "情熱あふれるフルスタック開発エンジニアです。確かなコンピュータサイエンスの基礎と豊富なプロジェクト経験を持ち、React、Vue、Spring Bootなどの主要技術に精通しています。分散システムやマイクロサービスアーキテクチャに深い理解があります。", avatarUrl: "/images/avatar.png", stats: [
    { value: "3+", label: "職務経験" },
    { value: "10+", label: "技術スタック" },
    { value: "500+", label: "オープンソース貢献" },
    { value: "50+", label: "チーム協力" },
  ] },
  education: [
    { school: "北京大学", degree: "master", major: "コンピュータサイエンス", period: "2020.09 - 2023.06", description: "分散システムとクラウドコンピューティングを研究。国家プロジェクト2件に参加、SCI論文1本発表。", gpa: "3.85/4.0" },
    { school: "武漢大学", degree: "bachelor", major: "ソフトウェア工学", period: "2016.09 - 2020.06", description: "データ構造、アルゴリズム設計、OS、ネットワークの中核科目を履修。3年連続奨学金受賞。", gpa: "3.78/4.0" },
  ],
  internships: [
    { company: "ByteDance", role: "フロントエンドインターン", period: "2022.06 - 2022.09", description: ["EC管理システムの商品管理モジュール開発", "React + TypeScriptでjQueryページをリファクタリング、性能40%向上", "仮想スクロール対応の汎用テーブルコンポーネント開発", "ユニットテスト作成、カバレッジ85%以上達成"], tags: ["React", "TypeScript", "Ant Design", "Jest"] },
    { company: "Tencent", role: "バックエンドインターン", period: "2021.07 - 2021.10", description: ["WeChat Payコアシステムの性能最適化に参加", "Goでマイクロサービス開発、日次1000万リクエスト処理", "Redisキャッシュ最適化でレスポンス時間30%短縮", "コードレビューとAPI文書作成"], tags: ["Go", "Redis", "gRPC", "Docker"] },
  ],
  work: [
    { company: "Alibaba", role: "シニアフルスタックエンジニア", period: "2023.07 - 現在", description: ["Taobao加盟店プラットフォームの設計と開発をリード", "マイクロフロントエンド移行を推進、10以上のサブアプリに分割", "高可用性分散タスクスケジューリングシステムを設計", "後輩の指導と技術共有セッションの開催"], tags: ["React", "Spring Boot", "Kubernetes", "マイクロフロントエンド"] },
  ],
  projects: [
    { name: "スマートキャンパスプラットフォーム", role: "フルスタック開発", period: "2023.01 - 2023.06", description: "授業管理、キャンパスナビ、忘れ物機能を集約したスマートキャンパスアプリを構築し、全校師生にサービスを提供。", technologies: ["React", "Node.js", "MongoDB", "WebSocket"], image: "", link: "", detail: "プロジェクトはフロントエンドとバックエンドを分離するアーキテクチャを採用。フロントエンドはReactでレスポンシブUIを構築し、バックエンドはNode.js + ExpressでRESTful APIを提供。リアルタイムメッセージプッシュ、地図ナビゲーション、時間割同期などのコア機能を実装。全国大学生科技イノベーションコンテストで2等奖を受賞。" },
    { name: "ECデータ分析システム", role: "フロントエンドリーダー", period: "2022.07 - 2022.12", description: "販売データ、ユーザー行動、市場トレンドをリアルタイムで監視できるビジュアルデータ分析プラットフォームを構築。", technologies: ["Vue.js", "ECharts", "Python", "Flask"], image: "", link: "", detail: "システムは多次元データフィルタリング、カスタムレポート生成、リアルタイムデータ更新をサポート。EChartsを使用して折れ線グラフ、棒グラフ、ヒートマップなどの豊富なチャート表示を実現。バックエンドはPython Flaskでデータ集計と分析を処理。" },
    { name: "オープンソースUIコンポーネントライブラリ", role: "コア開発者", period: "2021.09 - 現在", description: "高品質なReact UIコンポーネントライブラリの開発に参加。50以上の再利用可能なコンポーネントを提供し、GitHubで500+スターを獲得。", technologies: ["React", "TypeScript", "Storybook", "Rollup"], image: "", link: "", detail: "コンポーネントライブラリはMaterial Design设计规范に従い、テーマカスタマイズ、オンデマンドインポート、TypeScript型推論などの機能をサポート。Storybookを使用してコンポーネント開発とドキュメント展示を行い、Rollupでビルドサイズを最適化。" },
  ],
  hobbies: [
    { name: "プログラミング", description: "新技術の探求とOSS貢献", iconKey: "Code2", image: "", detail: "" },
    { name: "読書", description: "技術書やSF小説が好き", iconKey: "BookOpen", image: "", detail: "" },
    { name: "写真", description: "美しい瞬間をレンズで記録", iconKey: "Camera", image: "", detail: "" },
    { name: "音楽", description: "ギター愛好家、時々作曲", iconKey: "Music", image: "", detail: "" },
    { name: "フィットネス", description: "毎週の運動で健康維持", iconKey: "Dumbbell", image: "", detail: "" },
    { name: "旅行", description: "各地の文化と風景を探索", iconKey: "Plane", image: "", detail: "" },
  ],
  activities: [
    { title: "ACMプログラミングコンテスト", role: "チームリーダー", period: "2018.03 - 2019.11", description: "3人チームでACM-ICPCアジア地区大会に出場し銀メダル獲得。", iconKey: "Award" },
    { title: "情報学部学生会", role: "技術部長", period: "2017.09 - 2019.06", description: "ハッカソンや技術講演を10回以上開催、参加者累計2000人以上。", iconKey: "Users" },
    { title: "OSS貢献", role: "コアコントリビューター", period: "2019.01 - 現在", description: "GitHubで活発に活動、500+スター獲得。フロントエンドツールとUIコンポーネントに貢献。", iconKey: "Github" },
    { title: "キャンパス技術イノベーション大会", role: "プロジェクトリーダー", period: "2019.03 - 2019.12", description: "スマートキャンパスアプリを開発し全国2位を獲得。", iconKey: "Calendar" },
  ],
  contact: { email: "zhangming@example.com", phone: "+86 138-0000-0000", location: "杭州市, 浙江省, 中国" },
}

const defaultKo: SiteContent = {
  personal: { name: "장명", title: "풀스택 개발 엔지니어", tagline: "기술을 사랑하고, 탁월함을 추구하며, 코드로 가치를 창조합니다", about: "열정적인 풀스택 개발 엔지니어입니다. 탄탄한 컴퓨터 과학 기초와 풍부한 프로젝트 경험을 갖추고 있으며, React, Vue, Spring Boot 등 주요 기술 스택에 능숙합니다.", avatarUrl: "/images/avatar.png", stats: [
    { value: "3+", label: "직무 경험" },
    { value: "10+", label: "기술 스택" },
    { value: "500+", label: "오픈소스 기여" },
    { value: "50+", label: "팀 협업" },
  ] },
  education: [
    { school: "베이징대학교", degree: "master", major: "컴퓨터 과학", period: "2020.09 - 2023.06", description: "분산 시스템과 클라우드 컴퓨팅 연구. 국가 프로젝트 2건 참여, SCI 논문 1편 발표.", gpa: "3.85/4.0" },
    { school: "우한대학교", degree: "bachelor", major: "소프트웨어 공학", period: "2016.09 - 2020.06", description: "자료구조, 알고리즘, OS, 네트워크 핵심 과목 이수. 3년 연속 장학금 수상.", gpa: "3.78/4.0" },
  ],
  internships: [
    { company: "ByteDance", role: "프론트엔드 인턴", period: "2022.06 - 2022.09", description: ["전자상거래 관리 시스템 상품 모듈 개발", "React + TypeScript로 jQuery 페이지 리팩토링, 성능 40% 향상", "가상 스크롤 테이블 컴포넌트 개발", "단위 테스트 작성, 커버리지 85% 이상"], tags: ["React", "TypeScript", "Ant Design", "Jest"] },
    { company: "Tencent", role: "백엔드 인턴", period: "2021.07 - 2021.10", description: ["WeChat Pay 핵심 시스템 성능 최적화 참여", "Go로 마이크로서비스 개발, 일 1000만 요청 처리", "Redis 캐시 전략 최적화로 응답 시간 30% 단축", "코드 리뷰 및 기술 문서 작성"], tags: ["Go", "Redis", "gRPC", "Docker"] },
  ],
  work: [
    { company: "Alibaba", role: "시니어 풀스택 개발자", period: "2023.07 - 현재", description: ["타오바오 가맹점 플랫폼 핵심 모듈 설계 및 개발 리드", "마이크로 프론트엔드 마이그레이션 주도, 10개 이상 서브앱 분리", "고가용성 분산 태스크 스케줄링 시스템 설계", "주니어 엔지니어 멘토링 및 기술 공유"], tags: ["React", "Spring Boot", "Kubernetes", "마이크로 프론트엔드"] },
  ],
  projects: [
    { name: "스마트 캠퍼스 플랫폼", role: "풀스택 개발", period: "2023.01 - 2023.06", description: "수업 관리, 캠퍼스 네비게이션, 분실물 기능을 통합한 스마트 캠퍼스 앱을 개발하여 전교师生에게 서비스 제공.", technologies: ["React", "Node.js", "MongoDB", "WebSocket"], image: "", link: "", detail: "프로젝트는 프론트엔드와 백엔드를 분리하는 아키텍처를 채택. 프론트엔드는 React로 반응형 UI를 구축하고, 백엔드는 Node.js + Express로 RESTful API를 제공. 실시간 메시지 푸시, 지도 네비게이션, 시간표 동기화 등 핵심 기능 구현. 전국 대학생 과학기술 혁신 대회 2등상 수상." },
    { name: "전자상거래 데이터 분석 시스템", role: "프론트엔드 리더", period: "2022.07 - 2022.12", description: "판매 데이터, 사용자 행동, 시장 트렌드를 실시간으로 모니터링할 수 있는 시각화 데이터 분석 플랫폼 구축.", technologies: ["Vue.js", "ECharts", "Python", "Flask"], image: "", link: "", detail: "시스템은 다차원 데이터 필터링, 커스텀 리포트 생성, 실시간 데이터 새로고침을 지원. ECharts를 사용하여 꺾은선 그래프, 막대 그래프, 히트맵 등 풍부한 차트 표시 구현. 백엔드는 Python Flask로 데이터 집계 및 분석 처리." },
    { name: "오픈소스 UI 컴포넌트 라이브러리", role: "핵심 개발자", period: "2021.09 - 현재", description: "고품질 React UI 컴포넌트 라이브러리 개발 참여. 50개 이상의 재사용 가능한 컴포넌트를 제공하며 GitHub에서 500+ 스타 획득.", technologies: ["React", "TypeScript", "Storybook", "Rollup"], image: "", link: "", detail: "컴포넌트 라이브러리는 Material Design 디자인 규범을 따르며, 테마 커스터마이징, 온디맨드 가져오기, TypeScript 타입 추론 등의 기능을 지원. Storybook을 사용하여 컴포넌트 개발 및 문서 전시, Rollup으로 빌드 크기 최적화." },
  ],
  hobbies: [
    { name: "코딩", description: "새로운 기술 탐구와 오픈소스 기여", iconKey: "Code2", image: "", detail: "" },
    { name: "독서", description: "기술 서적과 SF 소설 읽기", iconKey: "BookOpen", image: "", detail: "" },
    { name: "사진", description: "렌즈로 아름다운 순간 기록", iconKey: "Camera", image: "", detail: "" },
    { name: "음악", description: "기타 애호가, 가끔 작곡", iconKey: "Music", image: "", detail: "" },
    { name: "운동", description: "매주 운동으로 건강 유지", iconKey: "Dumbbell", image: "", detail: "" },
    { name: "여행", description: "다양한 도시의 문화와 풍경 탐험", iconKey: "Plane", image: "", detail: "" },
  ],
  activities: [
    { title: "ACM 프로그래밍 대회", role: "팀장", period: "2018.03 - 2019.11", description: "3인 팀으로 ACM-ICPC 아시아 지역대회 참가, 은메달 획득.", iconKey: "Award" },
    { title: "컴퓨터학과 학생회", role: "기술부장", period: "2017.09 - 2019.06", description: "해커톤, 기술 강연 등 10회 이상 행사 주최, 참가자 2000명 이상.", iconKey: "Users" },
    { title: "오픈소스 커뮤니티", role: "핵심 기여자", period: "2019.01 - 현재", description: "GitHub에서 활발히 활동, 500+ 스타 획득.", iconKey: "Github" },
    { title: "캠퍼스 기술 혁신 대회", role: "프로젝트 리더", period: "2019.03 - 2019.12", description: "스마트 캠퍼스 앱 개발, 전국 2위 수상.", iconKey: "Calendar" },
  ],
  contact: { email: "zhangming@example.com", phone: "+86 138-0000-0000", location: "항저우시, 저장성, 중국" },
}

const defaultFr: SiteContent = {
  personal: { name: "Ming Zhang", title: "Développeur Full-Stack", tagline: "Passionné par la technologie, en quête d'excellence, créant de la valeur par le code", about: "Je suis un développeur full-stack passionné avec une solide formation en informatique et une riche expérience en projets. Maîtrise de React, Vue, Spring Boot et d'autres technologies. Compréhension approfondie des systèmes distribués et de l'architecture microservices.", avatarUrl: "/images/avatar.png", stats: [
    { value: "3+", label: "Ans d'expérience" },
    { value: "10+", label: "Technologies" },
    { value: "500+", label: "Contributions Open Source" },
    { value: "50+", label: "Collaborations d'équipe" },
  ] },
  education: [
    { school: "Université de Pékin", degree: "master", major: "Informatique", period: "2020.09 - 2023.06", description: "Recherche en systèmes distribués et cloud computing. 2 projets nationaux, 1 article SCI publié.", gpa: "3.85/4.0" },
    { school: "Université de Wuhan", degree: "bachelor", major: "Génie logiciel", period: "2016.09 - 2020.06", description: "Cours fondamentaux en structures de données, algorithmique, systèmes d'exploitation et réseaux.", gpa: "3.78/4.0" },
  ],
  internships: [
    { company: "ByteDance", role: "Stagiaire Frontend", period: "2022.06 - 2022.09", description: ["Développement du module gestion produits du back-office e-commerce", "Refactoring React + TypeScript des pages jQuery, +40% performance", "Développement d'un composant table avec défilement virtuel", "Tests unitaires avec couverture de 85%+"], tags: ["React", "TypeScript", "Ant Design", "Jest"] },
    { company: "Tencent", role: "Stagiaire Backend", period: "2021.07 - 2021.10", description: ["Optimisation des performances du système WeChat Pay", "Développement d'APIs microservices en Go, 10M+ requêtes/jour", "Optimisation du cache Redis, -30% de temps de réponse", "Revue de code et documentation technique"], tags: ["Go", "Redis", "gRPC", "Docker"] },
  ],
  work: [
    { company: "Alibaba", role: "Développeur Full-Stack Senior", period: "2023.07 - Présent", description: ["Architecture et développement de la plateforme marchands Taobao", "Migration micro-frontend, découpage en 10+ sous-applications", "Conception d'un système de planification de tâches distribuées", "Mentorat et partage technique au sein de l'équipe"], tags: ["React", "Spring Boot", "Kubernetes", "Micro-Frontend"] },
  ],
  projects: [
    { name: "Plateforme Campus Intelligent", role: "Développeur Full-Stack", period: "2023.01 - 2023.06", description: "Application campus intelligente intégrant gestion des cours, navigation et objets trouvés, au service de tous les enseignants et étudiants.", technologies: ["React", "Node.js", "MongoDB", "WebSocket"], image: "", link: "", detail: "Le projet adopte une architecture frontend/backend découplée. Frontend construit avec React pour une UI responsive, backend basé sur Node.js + Express fournissant des APIs RESTful. Implémente la messagerie en temps réel, la navigation cartographique, la synchronisation des emplois du temps. A remporté le 2e prix du Concours National d'Innovation Technologique des Étudiants." },
    { name: "Système d'Analyse de Données E-Commerce", role: "Lead Frontend", period: "2022.07 - 2022.12", description: "Plateforme d'analyse de données visuelle aidant les marchands à suivre en temps réel les ventes, le comportement des utilisateurs et les tendances du marché.", technologies: ["Vue.js", "ECharts", "Python", "Flask"], image: "", link: "", detail: "Le système prend en charge le filtrage de données multidimensionnel, la génération de rapports personnalisés et l'actualisation des données en temps réel. Utilise ECharts pour un affichage graphique riche incluant courbes, barres et cartes thermiques. Le backend utilise Python Flask pour l'agrégation et l'analyse des données." },
    { name: "Bibliothèque de Composants UI Open Source", role: "Développeur Principal", period: "2021.09 - Présent", description: "Contribué à une bibliothèque de composants UI React de haute qualité avec 50+ composants réutilisables, obtenant 500+ étoiles GitHub.", technologies: ["React", "TypeScript", "Storybook", "Rollup"], image: "", link: "", detail: "La bibliothèque suit les directives Material Design, prend en charge la personnalisation des thèmes, l'import à la demande et l'inférence de types TypeScript. Utilise Storybook pour le développement de composants et la documentation, Rollup pour l'optimisation de la taille du build." },
  ],
  hobbies: [
    { name: "Programmation", description: "Explorer de nouvelles technologies et contribuer à l'open source", iconKey: "Code2", image: "", detail: "" },
    { name: "Lecture", description: "Livres techniques et romans de science-fiction", iconKey: "BookOpen", image: "", detail: "" },
    { name: "Photographie", description: "Capturer les beaux moments avec l'objectif", iconKey: "Camera", image: "", detail: "" },
    { name: "Musique", description: "Guitariste amateur, compositeur occasionnel", iconKey: "Music", image: "", detail: "" },
    { name: "Sport", description: "Entraînement hebdomadaire pour rester en forme", iconKey: "Dumbbell", image: "", detail: "" },
    { name: "Voyage", description: "Explorer les cultures et paysages du monde", iconKey: "Plane", image: "", detail: "" },
  ],
  activities: [
    { title: "Concours ACM", role: "Chef d'équipe", period: "2018.03 - 2019.11", description: "Médaille d'argent à l'ACM-ICPC régionale Asie avec une équipe de 3.", iconKey: "Award" },
    { title: "Conseil étudiant CS", role: "Directeur tech", period: "2017.09 - 2019.06", description: "Organisation de 10+ événements dont hackathons et conférences, 2000+ participants.", iconKey: "Users" },
    { title: "Communauté Open Source", role: "Contributeur clé", period: "2019.01 - Présent", description: "Contributeur actif sur GitHub avec 500+ étoiles.", iconKey: "Github" },
    { title: "Concours d'innovation campus", role: "Chef de projet", period: "2019.03 - 2019.12", description: "Développement d'une app Campus Intelligent, 2e prix national.", iconKey: "Calendar" },
  ],
  contact: { email: "zhangming@example.com", phone: "+86 138-0000-0000", location: "Hangzhou, Zhejiang, Chine" },
}

const defaultEs: SiteContent = {
  personal: { name: "Ming Zhang", title: "Desarrollador Full-Stack", tagline: "Apasionado por la tecnología, buscando la excelencia, creando valor con código", about: "Soy un desarrollador full-stack apasionado con sólida formación en ciencias de la computación y amplia experiencia en proyectos. Dominio de React, Vue, Spring Boot y otras tecnologías principales.", avatarUrl: "/images/avatar.png", stats: [
    { value: "3+", label: "Años de experiencia" },
    { value: "10+", label: "Tecnologías" },
    { value: "500+", label: "Contribuciones Open Source" },
    { value: "50+", label: "Colaboraciones en equipo" },
  ] },
  education: [
    { school: "Universidad de Pekín", degree: "master", major: "Ciencias de la Computación", period: "2020.09 - 2023.06", description: "Investigación en sistemas distribuidos y computación en la nube. 2 proyectos nacionales, 1 artículo SCI.", gpa: "3.85/4.0" },
    { school: "Universidad de Wuhan", degree: "bachelor", major: "Ingeniería de Software", period: "2016.09 - 2020.06", description: "Cursos de estructuras de datos, algoritmos, sistemas operativos y redes.", gpa: "3.78/4.0" },
  ],
  internships: [
    { company: "ByteDance", role: "Practicante Frontend", period: "2022.06 - 2022.09", description: ["Desarrollo del módulo de gestión de productos del sistema e-commerce", "Refactorización con React + TypeScript, +40% rendimiento", "Desarrollo de componente tabla con scroll virtual", "Tests unitarios con cobertura del 85%+"], tags: ["React", "TypeScript", "Ant Design", "Jest"] },
    { company: "Tencent", role: "Practicante Backend", period: "2021.07 - 2021.10", description: ["Optimización del sistema central de WeChat Pay", "Desarrollo de APIs en Go, 10M+ peticiones diarias", "Optimización de caché Redis, -30% tiempo de respuesta", "Revisión de código y documentación técnica"], tags: ["Go", "Redis", "gRPC", "Docker"] },
  ],
  work: [
    { company: "Alibaba", role: "Desarrollador Full-Stack Senior", period: "2023.07 - Presente", description: ["Diseño y desarrollo de la plataforma de comerciantes Taobao", "Migración a micro-frontend, dividiendo en 10+ sub-aplicaciones", "Diseño de sistema distribuido de programación de tareas", "Mentoría y sesiones de intercambio técnico"], tags: ["React", "Spring Boot", "Kubernetes", "Micro-Frontend"] },
  ],
  projects: [
    { name: "Plataforma Campus Inteligente", role: "Desarrollador Full-Stack", period: "2023.01 - 2023.06", description: "Aplicación de campus inteligente que integra gestión de cursos, navegación y objetos perdidos, al servicio de todos los profesores y estudiantes.", technologies: ["React", "Node.js", "MongoDB", "WebSocket"], image: "", link: "", detail: "El proyecto adopta una arquitectura frontend/backend desacoplada. Frontend construido con React para una UI responsiva, backend basado en Node.js + Express proporcionando APIs RESTful. Implementa mensajería en tiempo real, navegación por mapas, sincronización de horarios. Ganó el 2do premio en el Concurso Nacional de Innovación Tecnológica Estudiantil." },
    { name: "Sistema de Análisis de Datos E-Commerce", role: "Líder Frontend", period: "2022.07 - 2022.12", description: "Plataforma de análisis de datos visual que ayuda a los comerciantes a monitorear en tiempo real las ventas, el comportamiento de usuarios y las tendencias del mercado.", technologies: ["Vue.js", "ECharts", "Python", "Flask"], image: "", link: "", detail: "El sistema soporta filtrado de datos multidimensional, generación de informes personalizados y actualización de datos en tiempo real. Usa ECharts para una rica visualización gráfica incluyendo gráficos de líneas, barras y mapas de calor. El backend usa Python Flask para agregación y análisis de datos." },
    { name: "Biblioteca de Componentes UI Open Source", role: "Desarrollador Principal", period: "2021.09 - Presente", description: "Contribuyó a una biblioteca de componentes UI React de alta calidad con 50+ componentes reutilizables, obteniendo 500+ estrellas en GitHub.", technologies: ["React", "TypeScript", "Storybook", "Rollup"], image: "", link: "", detail: "La biblioteca sigue las pautas de Material Design, soporta personalización de temas, importación bajo demanda e inferencia de tipos TypeScript. Usa Storybook para desarrollo de componentes y documentación, Rollup para optimización del tamaño del build." },
  ],
  hobbies: [
    { name: "Programación", description: "Explorar nuevas tecnologías y contribuir al open source", iconKey: "Code2", image: "", detail: "" },
    { name: "Lectura", description: "Libros técnicos y novelas de ciencia ficción", iconKey: "BookOpen", image: "", detail: "" },
    { name: "Fotografía", description: "Capturar momentos hermosos con la cámara", iconKey: "Camera", image: "", detail: "" },
    { name: "Música", description: "Guitarrista aficionado, compositor ocasional", iconKey: "Music", image: "", detail: "" },
    { name: "Fitness", description: "Rutina semanal de ejercicio para mantenerse saludable", iconKey: "Dumbbell", image: "", detail: "" },
    { name: "Viajes", description: "Explorar culturas y paisajes de distintas ciudades", iconKey: "Plane", image: "", detail: "" },
  ],
  activities: [
    { title: "Concurso ACM", role: "Capitán de equipo", period: "2018.03 - 2019.11", description: "Medalla de plata en ACM-ICPC regional Asia con equipo de 3.", iconKey: "Award" },
    { title: "Consejo estudiantil CS", role: "Director técnico", period: "2017.09 - 2019.06", description: "Organización de 10+ eventos incluyendo hackathones, 2000+ participantes.", iconKey: "Users" },
    { title: "Comunidad Open Source", role: "Contribuidor clave", period: "2019.01 - Presente", description: "Contribuidor activo en GitHub con 500+ estrellas.", iconKey: "Github" },
    { title: "Concurso de innovación campus", role: "Líder de proyecto", period: "2019.03 - 2019.12", description: "Desarrollo de app Campus Inteligente, 2do premio nacional.", iconKey: "Calendar" },
  ],
  contact: { email: "zhangming@example.com", phone: "+86 138-0000-0000", location: "Hangzhou, Zhejiang, China" },
}

export const defaultContent: Record<Locale, SiteContent> = {
  zh: defaultZh,
  en: defaultEn,
  ja: defaultJa,
  ko: defaultKo,
  fr: defaultFr,
  es: defaultEs,
}

// ---- Context ----

const STORAGE_KEY = "portfolio_content"

function loadContent(): Record<Locale, SiteContent> {
  try {
    const stored = localStorage.getItem(STORAGE_KEY)
    if (stored) {
      const parsed = JSON.parse(stored) as Record<Locale, SiteContent>
      // Deep merge with defaults to handle newly added fields
      const merged = {} as Record<Locale, SiteContent>
      for (const locale of Object.keys(defaultContent) as Locale[]) {
        const defaults = defaultContent[locale]
        const stored_data = parsed[locale]
        if (stored_data) {
          // Deep merge for nested objects
          merged[locale] = {
            ...defaults,
            ...stored_data,
            personal: {
              ...defaults.personal,
              ...(stored_data.personal || {}),
            },
            contact: {
              ...defaults.contact,
              ...(stored_data.contact || {}),
            },
            // For arrays, use stored data if exists, otherwise use defaults
            education: stored_data.education || defaults.education,
            internships: stored_data.internships || defaults.internships,
            work: stored_data.work || defaults.work,
            projects: stored_data.projects || defaults.projects,
            hobbies: stored_data.hobbies || defaults.hobbies,
            activities: stored_data.activities || defaults.activities,
          }
          
          // Ensure hobbies have all required fields
          merged[locale].hobbies = merged[locale].hobbies.map((hobby, idx) => ({
            ...defaults.hobbies[idx], // Use default as base
            ...hobby, // Override with stored data
          })).slice(0, merged[locale].hobbies.length)
        } else {
          merged[locale] = defaults
        }
      }
      return merged
    }
  } catch (e) {
    console.error('Failed to load content from localStorage:', e)
  }
  return { ...defaultContent }
}

function saveContent(content: Record<Locale, SiteContent>) {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(content))
}

interface ContentContextType {
  content: Record<Locale, SiteContent>
  getContent: (locale: Locale) => SiteContent
  updateContent: (locale: Locale, data: SiteContent) => void
  resetContent: () => void
}

const ContentContext = createContext<ContentContextType | null>(null)

export function ContentProvider({ children }: { children: ReactNode }) {
  const [content, setContent] = useState<Record<Locale, SiteContent>>(loadContent)

  // Load from server on mount
  useEffect(() => {
    let mounted = true

    const syncFromServer = async () => {
      const available = await isServerAvailable()
      if (!available || !mounted) return

      // Initialize WebSocket
      initWebSocket()

      // Fetch content for all locales
      const locales: Locale[] = ['zh', 'en', 'ja', 'ko', 'fr', 'es']
      const updates: Partial<Record<Locale, SiteContent>> = {}

      for (const locale of locales) {
        const serverData = await fetchContent(locale)
        if (serverData && serverData.content) {
          try {
            updates[locale] = JSON.parse(serverData.content)
          } catch (e) {
            console.error(`Failed to parse content for ${locale}:`, e)
          }
        }
      }

      if (Object.keys(updates).length > 0 && mounted) {
        setContent(prev => {
          const next = { ...prev, ...updates }
          saveContent(next)
          return next
        })
      }
    }

    syncFromServer()

    return () => {
      mounted = false
    }
  }, [])

  // Setup WebSocket listeners
  useEffect(() => {
    const handleUpdate = (locale: string, serverContent: SiteContent) => {
      setContent(prev => ({ ...prev, [locale]: serverContent }))
    }

    const locales: Locale[] = ['zh', 'en', 'ja', 'ko', 'fr', 'es']
    locales.forEach(locale => {
      onContentUpdate(locale, handleUpdate)
    })

    return () => {
      locales.forEach(locale => {
        offContentUpdate(locale)
      })
    }
  }, [])

  const getContent = useCallback(
    (locale: Locale) => content[locale] || defaultContent[locale],
    [content]
  )

  const updateContent = useCallback(async (locale: Locale, data: SiteContent) => {
    // Update local state immediately
    setContent((prev) => {
      const next = { ...prev, [locale]: data }
      saveContent(next)
      return next
    })

    // Sync to server asynchronously
    try {
      await saveToServer(locale, data)
    } catch (error) {
      console.warn('Failed to sync to server:', error)
    }
  }, [])

  const resetContent = useCallback(() => {
    const fresh = { ...defaultContent }
    setContent(fresh)
    localStorage.removeItem(STORAGE_KEY)
  }, [])

  return (
    <ContentContext.Provider value={{ content, getContent, updateContent, resetContent }}>
      {children}
    </ContentContext.Provider>
  )
}

export function useContent() {
  const ctx = useContext(ContentContext)
  if (!ctx) throw new Error("useContent must be used within ContentProvider")
  return ctx
}