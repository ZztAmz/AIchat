<template>
  <div class="allcontainer">
    <div class="containerbox">
      <div v-for="item in messageList" :key="item.id">
        <div>
          <span>{{ item.user }}</span>
        </div>
        <div>
          <div class="markdown-body answer" v-html="item.assistant"></div>
        </div>
      </div>
    </div>
    <div class="input-box">
      <el-input type="textarea"
        placeholder="请输入内容"
        v-model="question"
        :rows="4"
        @keydown.enter.native="handleKeyCode($event)">
      </el-input>
    </div>
  </div>
</template>

<script>
import store from '@/store'
import hljs from 'highlight.js'
import { mapGetters } from 'vuex'
import { fetchEventSource } from '@microsoft/fetch-event-source'
export default {
  name: 'Wel',
  data() {
    return {
      cancelTokenSourceRef:null,
      options:{
        mode:'llm',
        conversationId:''
      },
      question:'',
      md:null,
      message:'',
      messageList:[],
      currentQuestion:''
    }
  },
  computed: {
  },
  mounted() {
    this.initMdParser()
  },
  methods: {
    // 初始化markdown解析器
    initMdParser() {
      this.md = window.markdownit({
        html: false,
        linkify: true,
        highlight: function(str, lang) {
          if (lang && hljs.getLanguage(lang)) {
            try {
              return hljs.highlight(str, { language: lang }).value
            } catch (__) { }
          }

          return ''
        }
      })
    },
    send(act, extra) {
      let that = this
      let url = ''
      let data = ''  
      let history = []
      let testword = ''
      this.cancelTokenSourceRef = new AbortController()

      this.messageList.map(item=>{
        history.push({role:'user',content:item.user})
        history.push({role:'assistant',content:item.wordPlus})
      })

      url = '/chatai/chatAi/chat'
      data = {
        query: that.currentQuestion,
        chatAiHistoryBoList: history,
        conversationId: this.options.conversationId,
        indexNumber: undefined,
        promptName: 'default'
      }

      fetchEventSource(url, {
        method: 'post',
        headers: {
          'Content-Type': 'application/json',
          Accept: 'text/event-stream',
          Authorization: `Bearer ${store.getters.access_token}`,
          'Transfer-Encoding': 'chunked'
        },
        body: JSON.stringify(data),
        signal: that.cancelTokenSourceRef.signal,
        async onopen(response) {
          if (response.ok) {
            // 成功建立连接
            return
          } else {
            // 后端报500等情况
            const error = await response.json()
            throw new Error(error.detail)
          }
        },
        onmessage(msg) {
          try {
            const data = JSON.parse(msg.data)
            if (!data.conversationId) {
              if (data.text) {
                testword += data.text
                that.messageList[that.messageList.length - 1].wordPlus += data.text
                that.messageList[that.messageList.length - 1].assistant = that.md.render(testword)
              } else if (data.recommend) {
                 that.$set(currentAssistantMessage, 'recommend', JSON.parse(data.recommend))
               }
            } else if (that.options.conversationId != data.conversationId) {
              that.options.conversationId = data.conversationId
            }
          } catch (err) {
            
          }
        },
        onerror(err) {
          // onopen抛出的异常在onerror也要抛，否则会不断触发重连
          that.$message.error(that.errMsg)

          throw err
        },
        onclose() {
          console.log(that.messageList)
          console.log('请求结束，消息结束')
        },
        // 不设置的话用户离开当前页面会触发重连
        openWhenHidden: true
      })
    },
    handleKeyCode(e) {
      e.preventDefault()
      let keyCode = e.keyCode
      if (keyCode == 13) {
        if (!e.shiftKey) {
          e.preventDefault()
          let word = this.question
          this.currentQuestion = this.question
          this.messageList.push({id:Date.now(),user:word,assistant:'',wordPlus:''})
          this.question = ''
          this.send()
        } else {
          this.question += "\n";
        }
      }
    }
  }
}
</script>

<style scoped="scoped" lang="scss">
  .allcontainer {
    margin: 0 auto;
    width: 800px;
    height: 100%;
    overflow: auto;
    position: relative;
  }
  .containerbox {
    overflow: auto;
    height: calc(100% - 110px);
  }
  .input-box {
    position: absolute;
    left: 0;
    bottom: 40px;
    ::v-deep.el-textarea__inner {
      width: 800px;
      resize: none;
    }
  }
  .answer {
    padding: 20px 28px;
    border-radius: 4px;
    margin: 20px 0 20px 0;
  }
</style>
<style lang="less">
@import url('./styles/markdown.less');
@import url('./styles/highlight.less');
@import url('./styles/extra.less');
</style>