import $ from 'jquery';
import { Tooltip as ReactTooltip } from 'react-tooltip';

export default function Test_Bootstrap() {
    $(document).on('click','#change_color',function(){
        $( ".accordion-body" ).each(function( index ) {
            $(this).css('color', 'blue');
        });
    });

    $(document).on('click','#reset_color',function(){
        $( ".accordion-body" ).each(function( index ) {
            $(this).css('color', '#212529');
        });
    });
    
    return (
        <div className="row my-5">
            <div className="col-lg-12 mx-auto">
                <div className="d-flex justify-content-between">
                    <button type="button" id="reset_color" className="btn btn-success btn-sm" data-tooltip-id="my-tooltip" data-tooltip-content="Reset Accordion Text Color">
                        Reset Accordion Text Color
                    </button>
                    <button id="change_color" className="btn btn-primary btn-sm" data-tooltip-id="my-tooltip" data-tooltip-content="Change Accordion Text Color">
                        Change Accordion Text Color
                    </button>
                    <ReactTooltip id="my-tooltip" />
                </div>    
                <div className="accordion mt-3" id="accordionExample">
                    <div className="accordion-item">
                    <h2 className="accordion-header" id="headingOne">
                        <button className="accordion-button" type="button" data-bs-toggle="collapse" data-bs-target="#collapseOne" aria-expanded="true" aria-controls="collapseOne">
                        Accordion Item #1
                        </button>
                    </h2>
                    <div id="collapseOne" className="accordion-collapse collapse show" aria-labelledby="headingOne" data-bs-parent="#accordionExample">
                        <div className="accordion-body">
                        <strong>This is the first item's accordion body.</strong> It is shown by default, until the collapse plugin adds the appropriate classNamees that we use to style each element. These classNamees control the overall appearance, as well as the showing and hiding via CSS transitions. You can modify any of this with custom CSS or overriding our default variables. It's also worth noting that just about any HTML can go within the <code>.accordion-body</code>, though the transition does limit overflow.
                        </div>
                    </div>
                    </div>
                    <div className="accordion-item">
                    <h2 className="accordion-header" id="headingTwo">
                        <button className="accordion-button collapsed" type="button" data-bs-toggle="collapse" data-bs-target="#collapseTwo" aria-expanded="false" aria-controls="collapseTwo">
                        Accordion Item #2
                        </button>
                    </h2>
                    <div id="collapseTwo" className="accordion-collapse collapse" aria-labelledby="headingTwo" data-bs-parent="#accordionExample">
                        <div className="accordion-body">
                        <strong>This is the second item's accordion body.</strong> It is hidden by default, until the collapse plugin adds the appropriate classNamees that we use to style each element. These classNamees control the overall appearance, as well as the showing and hiding via CSS transitions. You can modify any of this with custom CSS or overriding our default variables. It's also worth noting that just about any HTML can go within the <code>.accordion-body</code>, though the transition does limit overflow.
                        </div>
                    </div>
                    </div>
                    <div className="accordion-item">
                    <h2 className="accordion-header" id="headingThree">
                        <button className="accordion-button collapsed" type="button" data-bs-toggle="collapse" data-bs-target="#collapseThree" aria-expanded="false" aria-controls="collapseThree">
                        Accordion Item #3
                        </button>
                    </h2>
                    <div id="collapseThree" className="accordion-collapse collapse" aria-labelledby="headingThree" data-bs-parent="#accordionExample">
                        <div className="accordion-body">
                        <strong>This is the third item's accordion body.</strong> It is hidden by default, until the collapse plugin adds the appropriate classNamees that we use to style each element. These classNamees control the overall appearance, as well as the showing and hiding via CSS transitions. You can modify any of this with custom CSS or overriding our default variables. It's also worth noting that just about any HTML can go within the <code>.accordion-body</code>, though the transition does limit overflow.
                        </div>
                    </div>
                    </div>
                </div>
            </div>
        </div>        
    ); 
}       
