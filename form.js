/*
  form constructor 
  version 2.3
  author Andrew Osipov
  http://simplephotoweb.ru
*/

(function($){
  $.fn._form = function($){
    var formContainer=this;
    var options={};
    jQuery.extend( options,{
      fields: [],
      formName: 'dyn-form',
      autoLabelsGlobal: false,
      className: 'dynamic-form',
      action: '',
      method: 'post',
      verify: true,
      isRequired: false,
      requiredText: 'Поля, отмеченные <b>*</b> обязательны для заполнения',
      alertText: 'Заполните обязательные поля',
      successText: 'Ваше сообщение отправлено. После проверки модератором оно появится на нашем сайте. Спасибо за внимание!', 
      submitText:'Отправить',
      submit: function(){        
        if( form_verify() ){
          //alert(options.successText)
          //form_empty();
          return true;
        }else alert( options.alertText );
        return false;
      }
    }, $);
    
    buildForm();
    formContainer.find('form').submit( options.submit );
    
    //--------------------------------------    
    function form_empty(){
      jQuery.each(options.fields, function(index, value){
        switch (value.type){
          case 'text':     value.element.find('input[type=text]').val( value.label ); break;            
          case 'textarea': value.element.find('textarea').val( value.label ); break;            
          default:         value.element.find('input[type=text]').val( value.label );
        }
      })
    }
        
    function form_verify(){  
      if( !options.verify ) return true;
      var result=true;
      jQuery.each(options.fields, function(index, value){
        if( value.required && value.element.css('display')=='block' ){
          var element;
          switch (value.type){
            case 'text':     element=value.element.find('input[type=text]'); break;
            case 'textarea': element=value.element.find('textarea'); break;
            case 'select':   element=value.element.find('select'); break;
            default:         element=value.element.find('input[type=text]');
          }
          if( value.autoField && (element.val()==value.label || element.val()=='') ){
             element.addClass('field-error');
             result=false;
          }else if( !value.autoField && element.val()=='' ){
             element.addClass('field-error');
             result=false;
          }else{ element.removeClass('field-error'); }
        }
      })
      return result;
    }
    
    //строит форму
    function buildForm(){ 
      var html;
      html = "<form name='"+options.formName+"' class='"+options.className+"' action='"+options.action+"' method='"+options.method+"'></form>";
      formContainer.html(html);
      jQuery.each(options.fields, function(index, value){
         value.element=jQuery( input(value) );
         formContainer.find("form").append( value.element );
         if( value.required ) options.isRequired=true;
      })
      if( options.isRequired ) formContainer.find("form").before("<div class='required-text'>"+options.requiredText+"</div>")
      if( options.sumbitImage != null && options.sumbitImage !='' ) formContainer.find("form").append("<input type='image' src='"+options.submitImage+"' class=\"form-submit\" />")
      else formContainer.find("form").append("<input type='submit' value='"+options.submitText+"' class=\"form-submit\" />");
      //formContainer.html(html);       
    }
    
    //генерирует поля input, textarea, submit
    function input(field){
      var obj=''; field.label+=(field.required)?"<b>*</b>":"";
      var value=( field.value!=null )?field.value:field.label;
      var errorField=( field.error!=null && field.error!='' )?'<div class="form-field-error">'+field.error+'</div>':'';
      var errorClass=( field.error!=null && field.error!='' )?' error':'';
      var className=( field.class!=null && field.class!='' )?' '+field.class+' ':'';
      var hidden=( field.hidden!=null && field.hidden )?' hidden ':'';
      var idField=options.formName+"-"+field.name;
      className='form-field '+className+hidden;
      className+=errorClass;
      switch (field.type){
        case 'text':{ 
          if( field.autoField ){ 
            obj="<div class='"+className+"'><input type='text' id='"+idField+"' name='"+field.name+"' onFocus=\"javascript:if(this.value=='"+field.label+"')this.value=''\" onBlur=\"javascript:if(this.value=='')this.value='"+field.label+"'\" value=\""+value+"\" /></div>"; 
          }else{ 
            var value=(field.value!=null)?field.value:'';
            obj="<div class='"+className+"'><label for='"+idField+"'>"+field.label+"</label>"; obj+="<input type='text' name='"+field.name+"' id='"+idField+"' value='"+value+"' /></div>"; 
          }
        } break;  
        case 'hidden':{ 
          obj="<input type='hidden' name='"+field.name+"' value=\""+field.value+"\" />";          
        } break;
        case 'checkbox':{ 
          obj="<div class='"+className+"'><input type='checkbox' id='"+idField+"' name='"+field.name+"' checked='"+value+"' /> <label for='"+idField+"'>"+field.label+"</label>"; obj+="</div>";
        } break; 
        case 'checkboxgroup':{          
          obj="<div class='"+className+"'><label>"+field.label+"</label><div class='checkbox-container'>"; 
          for( var key in field.values ){
            obj+="<span class='checkbox'><input type='checkbox' group='"+field.name+"' name='"+field.name+"' id='"+field.values[key].name+"' value='"+field.values[key].name+"' />";
            obj+="&nbsp;<label for='"+idField+"'>"+field.values[key].label+"</label></span>";
          }
          obj+="</div></div>";
        } break;
        case 'radiogroup':{          
          obj="<div class='"+className+"'><label>"+field.label+"</label><div class='radio-container'>"; 
          for( var key in field.values ){
            var checked=( field.values[key].default!=null )?'checked="checked"':'';
            obj+="<span class='radio'><input type='radio' group='"+field.name+"' name='"+field.name+"' id='"+field.values[key].value+"' "+checked+" value='"+field.values[key].value+"' />";
            obj+="&nbsp;<label for='"+field.values[key].value+"'>"+field.values[key].label+"</label></span>";
          }
          obj+="</span></span>";
        } break;
        case 'checkboxgroupDepended':{          
          obj="<div class='"+className+"'><label>"+field.label+"</label><div class='checkbox-container'></div></div>";
          
        } break;
        case 'password':{ 
          if( field.autoField ){ 
            obj="<div class='"+className+"'><input type='password' name='"+field.name+"' onFocus=\"javascript:if(this.value=='"+field.label+"')this.value=''\" onBlur=\"javascript:if(this.value=='')this.value='"+field.label+"'\" value=\""+value+"\" /></div>"; 
          }else{ 
            obj="<div class='form-field"+errorClass+"'><label for=''>"+field.label+"</label>"; obj+="<input type='password' name='"+field.name+"' /></div>"; 
          }
        } break;     
        case 'textarea':{ 
          if( field.autoField ){ obj="<div class='"+className+"'><textarea name='"+field.name+"' onFocus=\"javascript:if(this.innerText=='"+field.label+"')this.innerText=''; if(this.value=='"+field.label+"') this.value=''\" onBlur=\"javascript:if(this.innerText=='')this.innerText='"+field.label+"'; if(this.value=='')this.value='"+field.label+"';\">"+field.label+"</textarea></div>"; }
          else{ obj="<div class='form-field"+errorClass+"'><label for='"+idField+"'>"+field.label+"</label>"; obj+="<textarea id='"+idField+"' name='"+field.name+"'></textarea></div>"; }
        } break; 
        case 'select':{ 
          if( field.autoField ){ obj="<div class='"+className+"'><input type='text' name='"+field.name+"' onFocus=\"javascript:if(this.value=='"+field.label+"')this.value=''\" onBlur=\"javascript:if(this.value=='')this.value='"+field.label+"'\" value=\""+field.label+"\" /></div>"; }
          else{ 
            obj="<div class='"+className+"'><label for='"+idField+"'>"+field.label+"</label>"; 
            var _onClick='onChange=\'';
              //for( var i=0; i<field.showOnClick; i++ ){ 
                _onClick+='if( $(this).val()!="'+field.clickExcept+'" && $(this).val()!="" ){';
                  _onClick+='$(this).parent().parent().find(".hidden").slideDown();';
                _onClick+='}';
                _onClick+='else{ $(this).parent().parent().find(".hidden").slideUp(); }';                
              //}            
            _onClick+='\'';
            obj+="<select id='"+idField+"' name='"+field.name+"' "+_onClick+">";
            if( field.default==null || field.default=='' ){ obj+="<option selected value=''>...</option>"; }
            for( var key in field.value ){
              var selected=( field.value[key].value==field.default )?'selected':'';
              obj+="<option "+selected+" value='"+field.value[key].value+"'>"+field.value[key].name+"</option>"
            }
            obj+="</select></div>"; 
          }
        } break;         
        default:{ 
          if( field.autoField ){ obj="<div class='"+className+"'><input type='text' name='"+field.name+"' onFocus=\"javascript:if(this.value=='"+field.label+"')this.value=''\" onBlur=\"javascript:if(this.value=='')this.value='"+field.label+"'\" value=\""+field.label+"\" /></div>"; }
          else{ obj="<div class='"+className+"'><label for='"+idField+"'>"+field.label+"</label>"; obj+="<input type='text' id='"+idField+"' name='"+field.name+"' /></div>"; }
        }
     }
     obj=errorField+obj;
     return obj;
    }
      
  }
})(jQuery)